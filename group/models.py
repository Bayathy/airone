import importlib
import sys
from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import Group as DjangoGroup
from django.db import models
from django.db.models import Q

from airone.lib.types import AttrTypeValue


class Group(DjangoGroup):
    is_active = models.BooleanField(default=True)
    parent_group = models.ForeignKey(
        "Group", on_delete=models.DO_NOTHING, related_name="subordinates", null=True
    )

    def delete(self):
        """
        Override Model.delete method of Django
        """
        # replace parent_group of subordinates instances
        for child_group in self.subordinates.filter(is_active=True):
            child_group.parent_group = self.parent_group
            child_group.save(update_fields=["parent_group"])

        self.is_active = False
        self.name = "%s_deleted_%s" % (
            self.name,
            datetime.now().strftime("%Y%m%d_%H%M%S"),
        )
        self.save()

        # avoid circular import
        from airone.lib.elasticsearch import ESS

        es_object = ESS()
        for entry in [x for x in self.get_referred_entries() if x.id != self.id]:
            entry.register_es(es=es_object)

        if settings.ES_CONFIG:
            self.unregister_es()

    def register_es(self, es=None, skip_refresh=False):
        if not es:
            from airone.lib.elasticsearch import ESS

            es = ESS()

        es.index(doc_type="entry", id=self.id, body=self.get_es_document(es))
        if not skip_refresh:
            es.refresh()

    def unregister_es(self, es=None):
        if not es:
            from airone.lib.elasticsearch import ESS

            es = ESS()

        es.delete(doc_type="entry", id=self.id, ignore=[404])
        es.refresh(ignore=[404])

    def has_permission(self, target_obj, permission_level):
        """[NOTE]
        This function will be obsoleted, then will be alternated by Role feature
        """
        # A bypass processing to rapidly return.
        # This condition is effective when the public objects are majority.
        if target_obj.is_public:
            return True

        return any(
            [
                permission_level.id <= x.get_aclid()
                for x in self.permissions.all()
                if target_obj.id == x.get_objid()
            ]
        )

    def get_referred_entries(self, entity_name=None):
        # make query to identify AttributeValue that specify this Group instance
        query = Q(
            Q(
                is_latest=True,
                parent_attr__schema__type=AttrTypeValue["group"],
            )
            | Q(
                parent_attrv__is_latest=True,
                parent_attr__schema__type=AttrTypeValue["array_group"],
            ),
            value=str(self.id),
            parent_attr__parent_entry__is_active=True,
            parent_attr__parent_entry__schema__is_active=True,
        )
        if entity_name:
            query = Q(query, parent_attr__parent_entry__schema__name=entity_name)

        # import entry.models if it's necessary
        if "entry" in sys.modules:
            entry_model = sys.modules["entry"].models
        else:
            entry_model = importlib.import_module("entry.models")

        # get Entries that has AttributeValues, which specify this Group instance.
        return entry_model.Entry.objects.filter(
            pk__in=entry_model.AttributeValue.objects.filter(query).values_list(
                "parent_attr__parent_entry", flat=True
            )
        )

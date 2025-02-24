import math
from datetime import datetime, timezone
from typing import Optional, TypedDict

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from entry.models import Entry
from job.models import Job


class JobTarget(TypedDict):
    id: int
    name: str
    schema_id: Optional[int]
    schema_name: Optional[str]


class JobTargetSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    schema_id = serializers.IntegerField(allow_null=True)
    schema_name = serializers.CharField(allow_null=True)


class JobSerializers(serializers.ModelSerializer):
    target = serializers.SerializerMethodField(method_name="get_target")
    passed_time = serializers.SerializerMethodField(method_name="get_passed_time")

    class Meta:
        model = Job
        fields = ["id", "text", "status", "operation", "created_at", "target", "passed_time"]

    @extend_schema_field(JobTargetSerializer())
    def get_target(self, obj: Job) -> Optional[JobTarget]:
        if obj.target is not None:
            sub = obj.target.get_subclass_object()
            if isinstance(sub, Entry):
                return {
                    "id": sub.id,
                    "name": sub.name,
                    "schema_id": sub.schema.id,
                    "schema_name": sub.schema.name,
                }
            else:
                return {
                    "id": obj.target.id,
                    "name": obj.target.name,
                    "schema_id": None,
                    "schema_name": None,
                }
        else:
            return None

    def get_passed_time(self, obj: Job) -> int:
        if obj.is_finished():
            return math.floor((obj.updated_at - obj.created_at).total_seconds())
        else:
            return math.floor((datetime.now(timezone.utc) - obj.created_at).total_seconds())

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from entity.api_v2.serializers import EntitySerializer
from user.models import History
from airone.lib.http import http_get

from django.http.response import JsonResponse, HttpResponse

from entity.models import Entity


@http_get
def history(request, entity_id):
    if not Entity.objects.filter(id=entity_id).exists():
        return HttpResponse('Failed to get entity of specified id', status=400)

    # entity to be editted is given by url
    entity = Entity.objects.get(id=entity_id)
    histories = History.objects.filter(target_obj=entity, is_detail=False).order_by('-time')

    return JsonResponse([{
        'user': {
            'username': h.user.username,
        },
        'operation': h.operation,
        'details': [{
            'operation': d.operation,
            'target_obj': {
                'name': d.target_obj.name,
            },
            'text': d.text,
        } for d in h.details.all()],
        'time': h.time,
    } for h in histories], safe=False)


@extend_schema(
    parameters=[
        OpenApiParameter('query', OpenApiTypes.STR, OpenApiParameter.QUERY),
    ],
)
class EntityAPI(viewsets.ReadOnlyModelViewSet):
    serializer_class = EntitySerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        query = self.request.query_params.get('query', None)

        if query:
            return Entity.objects.filter(name__iregex=r'%s' % query, is_active=True).order_by('id')
        else:
            return Entity.objects.filter(is_active=True).order_by('id')

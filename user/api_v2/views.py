from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated

from user.api_v2.serializers import UserListSerializer, UserRetrieveSerializer
from user.models import User


class UserRetrievePermission(BasePermission):
    def has_object_permission(self, request, view, obj: User):
        current_user = request.user
        return current_user.is_superuser or current_user == obj


class UserRetrieveAPI(RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserRetrieveSerializer
    permission_classes = [IsAuthenticated & UserRetrievePermission]


class UserListAPI(ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]

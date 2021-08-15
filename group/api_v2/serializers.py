from typing import Dict
from rest_framework import serializers

from group.models import Group
from user.models import User


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ['id', 'name']


class GroupDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField(method_name='get_members')

    class Meta:
        model = Group
        fields = ['id', 'name', 'members']

    def get_members(self, obj: Group) -> Dict:
        users = User.objects.filter(groups__name=obj.name, is_active=True).order_by('username')
        return [{
            "id": u.id,
            "username": u.username,
        } for u in users]

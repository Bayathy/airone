from datetime import timedelta
from typing import Dict, Optional, TypedDict

from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoCoreValidationError
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError

from user.models import User


class UserToken(TypedDict):
    value: str
    lifetime: int
    expire: str
    created: str


class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = [
            "key",
        ]
        read_only_fields = ["key"]


class UserBaseSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField(method_name="get_date_joined")

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_superuser", "date_joined"]

    def get_date_joined(self, obj: User) -> str:
        return obj.date_joined.isoformat()


class UserCreateSerializer(UserBaseSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "is_superuser",
        ]

    def create(self, validate_data):
        return User.objects.create_user(request_data=validate_data)


class UserUpdateSerializer(UserBaseSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "is_superuser",
        ]


class UserRetrieveSerializer(UserBaseSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_superuser",
            "date_joined",
            "token",
            "authenticate_type",
        ]

    def get_token(self, obj: User) -> Optional[UserToken]:
        current_user = self.context["request"].user
        if (current_user.id == obj.id or current_user.is_superuser) and obj.token:
            return {
                "value": str(obj.token),
                "lifetime": obj.token_lifetime,
                "expire": (obj.token.created + timedelta(seconds=obj.token_lifetime)).strftime(
                    "%Y/%m/%d %H:%M:%S"
                ),
                "created": obj.token.created.strftime("%Y/%m/%d %H:%M:%S"),
            }
        else:
            return None


class UserListSerializer(UserBaseSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_superuser", "date_joined"]


class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    password1 = serializers.CharField()
    password2 = serializers.CharField()

    token_generator = default_token_generator

    def _get_user(self) -> Optional[User]:
        try:
            uidb64 = self.initial_data.get("uidb64")
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (ValueError, TypeError, OverflowError, User.DoesNotExist, ValidationError):
            return None
        return user

    def validate_token(self, value: str):
        user = self._get_user()
        if not user:
            raise ValidationError("user not found")

        if not self.token_generator.check_token(user=user, token=value):
            raise ValidationError("invalid token given")

        return value

    def validate(self, attrs: Dict):
        password1 = attrs.get("password1")
        password2 = attrs.get("password2")

        if password1 != password2:
            raise ValidationError("passwords do not match")

        try:
            password_validation.validate_password(password1)
        except DjangoCoreValidationError as e:
            raise ValidationError("invalid password given. details: %s" % e)

        return attrs

    def create(self, validated_data):
        user = self._get_user()
        if not user:
            raise ValidationError("user not found")

        password = validated_data.get("password1")
        user.set_password(password)
        user.save()

        return validated_data

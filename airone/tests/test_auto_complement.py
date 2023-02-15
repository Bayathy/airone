from django.conf import settings

from airone.lib import auto_complement
from airone.lib.test import AironeTestCase
from user.models import User


class LibAutoComplementTest(AironeTestCase):
    def setUp(self):
        super(LibAutoComplementTest, self).setUp()

        # When both user and password were correct, it would be success.
        self.user = User(username="guest", email="guest@example.com", is_superuser=False)
        self.user.set_password("guest")
        self.user.save()

        # make auto complement user
        self.complement_user = User(
            username=settings.AIRONE["AUTO_COMPLEMENT_USER"],
            email="hoge@example.com",
            is_superuser=True,
        )
        self.complement_user.set_password(settings.AIRONE["AUTO_COMPLEMENT_USER"])
        self.complement_user.save()

    def test_get_auto_complement_user(self):
        # call get_auto_complement_user
        user = auto_complement.get_auto_complement_user(self.user)

        # Check user id
        self.assertEqual(user.id, self.complement_user.id)
        self.assertEqual(user.username, self.complement_user.username)

    def test_get_auto_complement_user_not_exist_complement_user(self):
        # If 'AUTO_COMPLEMENT_USER' in settings does not exist
        del settings.AIRONE["AUTO_COMPLEMENT_USER"]

        # call get_auto_complement_user
        user = auto_complement.get_auto_complement_user(self.user)

        # Check user id
        self.assertEqual(user.id, self.user.id)
        self.assertEqual(user.username, self.user.username)

    def test_get_auto_complement_user_none_complement_user(self):
        # If 'AUTO_COMPLEMENT_USER' in settings is None
        settings.AIRONE["AUTO_COMPLEMENT_USER"] = None

        # call get_auto_complement_user
        user = auto_complement.get_auto_complement_user(self.user)

        # Check user id
        self.assertEqual(user.id, self.user.id)
        self.assertEqual(user.username, self.user.username)

    def test_get_auto_complement_user_unmatch_complement_user(self):
        # If 'AUTO_COMPLEMENT_USER' in settings is unmatch
        settings.AIRONE["AUTO_COMPLEMENT_USER"] = settings.AIRONE["AUTO_COMPLEMENT_USER"] + "1"

        # call get_auto_complement_user
        user = auto_complement.get_auto_complement_user(self.user)

        # Check user id
        self.assertEqual(user.id, self.user.id)
        self.assertEqual(user.username, self.user.username)

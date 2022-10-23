from django.contrib.auth import user_logged_out
from rest_framework.response import Response


def logoutAll(request) -> bool:
    if not request.user:
        return False
    request.user.auth_token_set.all().delete()
    user_logged_out.send(sender=request.user.__class__,
                         request=request, user=request.user)
    return True


def logoutOne(request) -> bool:
    pass

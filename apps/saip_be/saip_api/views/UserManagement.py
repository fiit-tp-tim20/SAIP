from django.utils import timezone

from django.contrib.auth import login, user_logged_out

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from knox.auth import AuthToken
from knox.settings import knox_settings

from ..serializers import RegisterSerializer


class LoginView(APIView):

    def post(self, request) -> Response:
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        token_limit = knox_settings.TOKEN_LIMIT_PER_USER
        if token_limit is not None:
            now = timezone.now()
            token = user.auth_token_set.filter(expiry__gt=now)
            if token.count() >= token_limit:
                return Response({"detail": "Maximum amount of tokens allowed per user exceeded."}, status=403)

        instance, token = AuthToken.objects.create(user)

        login(request, user)

        user.save()

        return Response({
            "token": token,
            "expiry": instance.expiry
        }, status=200)


def logout_all(request) -> bool:
    """Logout user from all sessions."""
    if not request.user:
        return False
    request.user.auth_token_set.all().delete()
    user_logged_out.send(sender=request.user.__class__,
                         request=request, user=request.user)
    return True


class ChangePasswordView(APIView):

    def put(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        password = request.data.get('password')

        if not password:
            return Response({
                "detail": "Password is required"
            }, status=400)

        if not logout_all(request):
            return Response({
                "detail": "Failed to logout"
            }, status=500)

        request.user.set_password(password)
        request.user.save()

        return Response({"detail": "Password changed successfully"}, status=200)


class RegisterView(APIView):

    def post(self, request) -> Response:
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        _ = serializer.save()

        return Response(status=201)


# class TestView(APIView):
#     """Test view to check if user is authenticated."""
#
#     def get(self, request) -> Response:
#         if not request.user or not request.user.is_authenticated:
#             return Response({"detail": "User is not authenticated."}, status=401)
#
#         return Response({
#             "user_id": request.user.id
#         }, status=200)

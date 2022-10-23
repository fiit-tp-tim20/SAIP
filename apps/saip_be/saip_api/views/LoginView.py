from django.utils import timezone

from django.contrib.auth import login

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from knox.auth import AuthToken
from knox.settings import knox_settings


class LoginView(APIView):

    def post(self, request) -> Response:
        token_limit = knox_settings.TOKEN_LIMIT_PER_USER
        if token_limit is not None:
            now = timezone.now()
            token = request.user.auth_token_set.filter(expiry__gt=now)
            if token.count() >= token_limit:
                return Response({"detail": "Maximum amount of tokens allowed per user exceeded."}, status=403)

        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        instance, token = AuthToken.objects.create(user)

        login(request, user)

        user.save()

        return Response({
            "userID": user.id,
            "token": token,
            "expiry": instance.expiry
        }, status=200)

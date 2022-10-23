from django.contrib.auth import login

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from knox.auth import AuthToken


class LoginView(APIView):

    def post(self, request) -> Response:
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

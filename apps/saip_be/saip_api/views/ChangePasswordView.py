from typing import Type

from knox.views import LogoutAllView

from rest_framework.response import Response
from rest_framework.views import APIView

from ..functions.Logouts import logoutAll


class ChangePasswordView(APIView):

    def put(self, request) -> Response:
        password = request.data.get('password')

        if not password:
            return Response({
                "detail": "Password is required"
            }, status=400)

        request.user.set_password(password)
        request.user.save()

        if not logoutAll(request.user):
            return Response({
                "detail": "Failed to logout"
            }, status=500)

        return Response({"detail": "Password changed successfully"}, status=200)

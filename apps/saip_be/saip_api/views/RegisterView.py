from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import RegisterSerializer


class RegisterView(APIView):

    def post(self, request) -> Response:
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response({
            "user_id": user.username
        }, status=201)

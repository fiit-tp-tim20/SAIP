from rest_framework.response import Response
from rest_framework.views import APIView


class TestView(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        return Response({
            "user_id": request.user.id
        }, status=200)

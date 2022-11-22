from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, GameParameters

from ..serializers import GameSerializer

from django.core import serializers

parameters = {"GameParameters": {"budget_cap": 10000,
                                 "depreciation": 0.1}}


class CreateGameView(APIView):

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        serializer = GameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        game_parameters = GameParameters.objects.create(**parameters["GameParameters"])
        game_parameters.save()

        game = serializer.save()
        game.parameters = game_parameters
        game.admin = request.user
        game.save()

        return Response({"gameID": game.id}, status=201)

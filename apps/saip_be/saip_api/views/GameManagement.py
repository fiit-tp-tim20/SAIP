from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, GameParameters

from django.contrib.auth.mixins import PermissionRequiredMixin

from ..serializers import GameSerializer

from datetime import timezone, datetime

parameters = {"GameParameters": {"budget_cap": 10000,
                                 "depreciation": 0.1}}


class CreateGameView(PermissionRequiredMixin, APIView):
    permission_required = 'saip_api.add_game'

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


class GetRunningGamesView(APIView):

    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        games = Game.objects.filter(end__isnull=True)
        response = {"games": [{"id": game.id,
                               "name": game.name}
                              for game in games]}

        return Response(response)

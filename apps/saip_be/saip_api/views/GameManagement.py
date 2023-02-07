from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, GameParameters, Upgrade, Turn, Company, CompaniesState

from django.contrib.auth.mixins import PermissionRequiredMixin

from ..serializers import GameSerializer

from saip_simulation.simulation import Simulation

parameters = {"GameParameters": {"budget_cap": 10000,
                                 "depreciation": 0.1},
              "Upgrades": [{"name": "Battery", "cost": 15000, "sales_effect": 0.75, "man_cost_effect": 0.3,
                            "camera_pos": "1,2,3", "camera_rot": "3,2,1"},
                           {"name": "Frame", "cost": 11000, "sales_effect": 0.55, "man_cost_effect": 0.2,
                            "camera_pos": "4,5,6", "camera_rot": "6,5,4"},
                           {"name": "Brakes", "cost": 9000, "sales_effect": 0.45, "man_cost_effect": 0.1,
                            "camera_pos": "7,8,9", "camera_rot": "9,8,7"},
                           {"name": "Display", "cost": 17000, "sales_effect": 0.85, "man_cost_effect": 0.4,
                            "camera_pos": "7,8,9", "camera_rot": "9,8,7"}
                           ]}


def create_default_upgrades(game: Game) -> None:
    if not Upgrade.objects.all():
        for upgrade in parameters["Upgrades"]:
            Upgrade.objects.create(name=upgrade["name"], cost=upgrade["cost"], sales_effect=upgrade["sales_effect"],
                                   man_cost_effect = upgrade['man_cost_effect'], camera_pos=upgrade["camera_pos"],
                                   camera_rot=upgrade["camera_rot"]).save()


def create_turn(number: int, game: Game) -> None:
    turn = Turn.objects.create(number=number, game=game)
    companies = Company.objects.filter(game=game)

    for company in companies:
        CompaniesState.objects.create(turn=turn, company=company).save()


def get_last_turn(game: Game) -> Turn:
    return Turn.objects.get(game=game, end__isnull=True)


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

        create_default_upgrades(game)
        create_turn(0, game)

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


class EndTurnView(PermissionRequiredMixin, APIView):
    permission_required = 'saip_api.add_turn'

    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            game = Game.objects.get(pk=request.GET.get("gameID"))
        except Game.DoesNotExist:
            return Response({"detail": "Game not found"}, status=404)

        if game.end is not None:
            return Response({"detail": "Game has already ended"}, status=400)

        if game.admin != request.user:
            return Response({"detail": "User is not admin for this game"}, status=401)

        last_turn = get_last_turn(game)

        return Response({"Number": last_turn.number, "Start": last_turn.start, "Game": game.name}, status=200)

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            game = Game.objects.get(pk=request.GET.get("gameID"))
        except Game.DoesNotExist:
            return Response({"detail": "Game not found"}, status=404)

        if game.end is not None:
            return Response({"detail": "Game has already ended"}, status=400)

        if game.admin != request.user:
            return Response({"detail": "User is not admin"}, status=403)

        turn = get_last_turn(game)
        turn.end = timezone.now()
        
        turn.save()

        create_turn(turn.number + 1, game)

        # start simulation here
        sim = Simulation(game_model=game, turn_model=turn)
        sim.write_simulation_results()
        
        return Response({"detail": "Turn ended, simulation started"}, status=200)

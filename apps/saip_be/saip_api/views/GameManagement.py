from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, GameParameters, Upgrade, Turn, Company, CompaniesState, Production, Marketing, Factory, CompaniesUpgrades, MarketState, TeacherDecisions

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


def create_company_state(company: Company, turn: Turn) -> CompaniesState:
    cs = CompaniesState.objects.create(turn=turn, company=company)
    production = Production.objects.create()
    cs.production = production
    marketing = Marketing.objects.create()
    cs.marketing = marketing
    factory = Factory.objects.create()
    cs.factory = factory

    cs.save()

    return cs

def create_turn(number: int, game: Game) -> Turn:
    turn = Turn.objects.create(number=number, game=game)
    MarketState.objects.create(turn=turn).save()
    TeacherDecisions.objects.create(turn=turn).save()
    
    companies = Company.objects.filter(game=game)
    
    for company in companies:
        create_company_state(company, turn)

    return turn


def get_last_turn(game: Game) -> Turn:
    return Turn.objects.filter(game=game, end__isnull=True).order_by('-number').first()


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
    
class GetNotStartedGamesView(APIView):

    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        turns = Turn.objects.filter(end__isnull=True, number=0)
        response = {"games": [{"id": turn.game.id,
                               "name": turn.game.name}
                              for turn in turns]}

        return Response(response)


def calculate_man_cost(game: Game, turn: Turn) -> None:

    companies = Company.objects.filter(game=game)
    base_cost = game.parameters.base_man_cost

    for company in companies:

        company_upgrades = CompaniesUpgrades.objects.filter(company=company, status="f")
        cost = 1
        for upgrade in company_upgrades:
            cost += upgrade.upgrade.man_cost_effect

        value = base_cost * cost

        company_state = CompaniesState.objects.get(company=company, turn=turn)
        company_state.production.man_cost = round(value, 2)
        company_state.production.save()
        company_state.save()
   

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
        if turn.number != 0:
            companies = Company.objects.filter(game=game)
            for company in companies:
                state = CompaniesState.objects.get(company=company, turn=turn)
                if state.committed == False and state.cash >= 10000:
                    state_prev = CompaniesState.objects.get(company=company, turn=Turn.objects.get(game=company.game, number=turn.number-1))
                    state.production.volume = state_prev.production.volume
                    state.production.sell_price = state_prev.production.sell_price

                    state.factory.capital = state_prev.factory.capital

                    state.marketing.viral = state_prev.marketing.viral
                    state.marketing.podcast = state_prev.marketing.podcast
                    state.marketing.tv = state_prev.marketing.tv
                    state.marketing.billboard = state_prev.marketing.billboard
                    state.marketing.ooh = state_prev.marketing.ooh

        end_turn(turn)
        
        return Response({"detail": "Turn ended, simulation started"}, status=200)

def end_turn(turn: Turn) -> Turn:
    game = turn.game

    new_turn = create_turn(turn.number + 1, game)
    calculate_man_cost(game, new_turn)

    # if turn.number != 0:
        # sim = Simulation(game_model=game, turn_model=turn, new_turn_model=new_turn)
        # sim.run_simulation()
        # sim.write_simulation_results()

    turn.end = timezone.now()
    turn.save()

    return new_turn

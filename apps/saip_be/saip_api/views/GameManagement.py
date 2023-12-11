from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, GameParameters, Upgrade, Turn, Company, CompaniesState, Production, Marketing, \
    Factory, CompaniesUpgrades, MarketState, TeacherDecisions

from django.contrib.auth.mixins import PermissionRequiredMixin

from ..serializers import GameSerializer

from saip_simulation.simulation import Simulation
from saip_simulation.bot import LowPriceStrategyBot, HighPriceStrategyBot, AveragePriceStrategyBot

from django.core.cache import cache
# default upgrages, table is create only if it is empty
parameters = {"Upgrades": [{"name": "Batéria", "cost": 30000, "sales_effect": 0.75, "man_cost_effect": 0.3,
                            "camera_pos": "-0.1, 0.5, 3", "camera_rot": "3,2,1", "description": "Investícia do batérie predlžuje výdrž elektrického bicykla na cestách, a tým zaujme najmä zákazníkov, \
                            ktorí si potrpia na väčšej výdrži batérie. Investíciou do tohto vylepšenia sa zvýšia výrobné náklady \
                            o 30%, ale taktiež sa aj zvýši záujem u zákazníkov, ktorých zaujímajú vylepšenia o 75%."},
                           {"name": "Rám", "cost": 22000, "sales_effect": 0.55, "man_cost_effect": 0.2,
                            "camera_pos": "0, 0.5, 5", "camera_rot": "6,5,4", "description": "Investícia do rámu zaujme najmä zákazníkov, ktorých zaujíma vzhľad a celková konštrukcia bicykla. \
                            Táto investícia spôsobí nárast výrobných nákladov o 20% a záujem zákazníkov zameraných na vylepšenia o 55%."},
                           {"name": "Brzdy", "cost": 18000, "sales_effect": 0.45, "man_cost_effect": 0.1,
                            "camera_pos": "-0.7, 1.5, 3", "camera_rot": "9,8,7", "description": "Investíciou do tohto vylepšenia sa zvýši celková bezpečnosť pri používaní bicykla na cestách, ale aj \
                            v inom teréne. Výrobné náklady sa pri tejto investícii zvýšia o 10% a záujem zákazníkov zameraných na vylepšenia o 45%."},
                           {"name": "Displej", "cost": 34000, "sales_effect": 0.85, "man_cost_effect": 0.4,
                            "camera_pos": "-0.7, 1.5, 3", "camera_rot": "9,8,7", "description": "Displej na elektrobicykli je neodmysliteľnou súčasťou pre celkové ovládanie a lepší pocit z jazdy, keď \
                            potrebujeme prehľad o tom akou rýchlosťou ideme, koľko kilometrov sme už na aktuálnej trase prešli a iné \
                            štatistiky. Investíciou do tohto vylepšenia sa zvýšia výrobné náklady o 40% a záujem zákazníkov zameraných na vylepšenia o 85%."}
                           ]}


def create_default_upgrades() -> None:
    """Creates default upgrades if the table is empty"""
    if not Upgrade.objects.all():
        for upgrade in parameters["Upgrades"]:
            Upgrade.objects.create(name=upgrade["name"], cost=upgrade["cost"], sales_effect=upgrade["sales_effect"],
                                   man_cost_effect=upgrade['man_cost_effect'], camera_pos=upgrade["camera_pos"],
                                   camera_rot=upgrade["camera_rot"], description=upgrade["description"]).save()


def create_company_state(company: Company, turn: Turn) -> CompaniesState:
    """Creates company state for the given company and turn and populates it with classes with default values"""
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
    """Creates turn for the given game and number, copies previous teacher decisions and calls company state and market state creation"""
    turn = Turn.objects.create(number=number, game=game)
    MarketState.objects.create(turn=turn).save()

    try:
        prev_td = TeacherDecisions.objects.get(turn__game=game, turn__number=number - 1)
    except TeacherDecisions.DoesNotExist:
        TeacherDecisions.objects.create(turn=turn).save()
    else:
        prev_td.pk = None
        prev_td.turn = turn
        prev_td.save()

    companies = Company.objects.filter(game=game)

    for company in companies:
        create_company_state(company, turn)

    return turn


def get_last_turn(game: Game) -> Turn:
    """Returns last turn for the given game"""
    return Turn.objects.filter(game=game, end__isnull=True).order_by('-number').first()


class CreateGameView(PermissionRequiredMixin, APIView):
    permission_required = 'saip_api.add_game'

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        serializer = GameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        game_parameters = GameParameters.objects.create()
        game_parameters.save()

        game = serializer.save()
        game.parameters = game_parameters
        game.admin = request.user
        game.save()

        create_default_upgrades()
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

        end_turn(turn)

        return Response({"detail": "Turn ended, simulation started"}, status=200)


def end_turn(turn: Turn) -> Turn:
    game = turn.game

    if turn.number == 0:
        bot_list = []
        for i in range(1):
            bot = AveragePriceStrategyBot()
            bot.add_to_game(game_id=game.id)
            bot_list.append(bot)
        cache.set(game.id, bot_list)

    if turn.number != 0:
        bot_list = cache.get(game.id)
        for bot in bot_list:
            bot.play_turn(turn_number=turn.number)


    if turn.number != 0:
        companies = Company.objects.filter(game=game)
        for company in companies:
            state = CompaniesState.objects.get(company=company, turn=turn)
            if state.committed == False and state.cash >= 10000:
                state_prev = CompaniesState.objects.get(company=company, turn=Turn.objects.get(game=company.game,
                                                                                               number=turn.number - 1))
                state.production.volume = state_prev.production.volume
                state.production.sell_price = state_prev.production.sell_price

                state.factory.capital = state_prev.factory.capital

                state.marketing.viral = state_prev.marketing.viral
                state.marketing.podcast = state_prev.marketing.podcast
                state.marketing.tv = state_prev.marketing.tv
                state.marketing.billboard = state_prev.marketing.billboard
                state.marketing.ooh = state_prev.marketing.ooh

                state.factory.save()
                state.production.save()
                state.marketing.save()
                state.save()

    new_turn = create_turn(turn.number + 1, game)
    calculate_man_cost(game, new_turn)

    if turn.number != 0:
        prev_turn = Turn.objects.get(game=game, number=turn.number - 1)
        sim = Simulation(game_model=game, turn_model=turn, next_turn_model=new_turn, prev_turn_model=prev_turn)
        sim.run_simulation()
        sim.write_simulation_results()

    print("Nové kolo...")
    turn.end = timezone.now()
    turn.save()

    return new_turn

from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn, CompaniesUpgrades

from ..serializers import CompanySerializer, ProductionSerializer, SpendingsSerializer, MaketingSerializer, FactorySerializer

from .GameManagement import get_last_turn

from django.core import serializers

def create_upgrade_company_relation(game: Game, company: Company) -> None:
    for upgrade in Upgrade.objects.all():
        CompaniesUpgrades.objects.create(upgrade=upgrade, company=company, game=game)

class CompanyInfo(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        return Response({"id": company.id, 'name': company.name, 'budget_cap': company.game.parameters.budget_cap}, status=200)

class CompanyReport(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        last_turn = get_last_turn(company.game)
        company_state = CompaniesState.objects.get(turn=last_turn, company=company)
        company_state_previous = CompaniesState.objects.get(turn=Turn.objects.get(number=last_turn.number-1), company=company)

        production = dict()
        production['production'] = company_state_previous.production.volume
        production['capacity'] = company_state_previous.factory.capacity
        production['utilization'] = (company_state_previous.production.volume/company_state_previous.factory.capacity)*100
        production['man_cost'] = company_state_previous.production.man_cost
        production['new_inventory'] = company_state.inventory

        sales = dict()
        sales['orders_received'] = company_state_previous.orders_received
        sales['orders_fulfilled'] = company_state_previous.orders_fulfilled
        sales['orders_unfulfilled'] = company_state_previous.orders_received - company_state_previous.orders_fulfilled
        sales['selling_price'] = company_state_previous.production.sell_price

        balance = dict()
        balance['cash'] = company_state.cash
        balance['inventory_money'] = company_state.inventory * company_state.production.man_cost
        balance['capital_investments'] = company_state_previous.capital_invesments
        balance['ret_earnings'] = company_state_previous.ret_earnings
        balance['base_capital'] = company.game.parameters.base_capital

        cash_flow = dict()
        cash_flow['beginning_cash'] = CompaniesState.objects.get(turn=Turn.objects.get(number=last_turn.number-2), company=company).cash
        cash_flow['net_profit'] = company_state_previous.net_profit
        cash_flow['depreciation'] = company_state_previous.depreciation
        cash_flow['capital_investment'] = company_state_previous.factory.capital
        cash_flow['new_loans'] = company_state_previous.new_loans
        cash_flow['inventory_change'] = company_state_previous.inventory_change

        # r_d_list = []
        # marketing_list = []
        # volume_list = []
        # inventory_list = []
        # sold_list = []

        # for turn in range(1, last_turn.number):
        #     company_state = CompaniesState.objects.get(turn=Turn.objects.get(number=turn), company=company)
        #     r_d_list.append(company_state.r_d)
        #     marketing_list.append([company_state.marketing.viral, company_state.marketing.billboard, company_state.marketing.podcast, company_state.marketing.ooh, company_state.marketing.tv])
        #     volume_list.append(company_state.production.volume)
        #     inventory_list.append(company_state.inventory)
        #     sold_list.append(company_state.production.sold)


        #     if turn == (last_turn.number - 1):
        #         r_d = company_state.r_d
        #         marketing = company_state.marketing.billboard + company_state.marketing.tv + company_state.marketing.ooh + company_state.marketing.viral + company_state.marketing.podcast
        #         capacity = company_state.factory.capacity
        #         man_cost = company_state.production.man_cost
        #         stock_price = company_state.stock_price
        #         inventory = company_state.inventory
        #         utilization = (company_state.production.volume/capacity) * 100
        #         sold = company_state.production.sold


        # return Response({"r_d": r_d, "marketing": marketing, 'stock_price': stock_price, 'inventory': inventory, 'capacity': capacity, 'utilization': utilization, 'man_cost': man_cost, 'sold': sold, 'r_d_list': r_d_list, 'marketing_list': marketing_list, 'volume_list': volume_list, 'inventory_list': inventory_list, 'sold_list': sold_list}, status=200)
  

class CreateCompanyView(APIView):

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company = serializer.save()

        company.user = request.user
        company.save()

        create_upgrade_company_relation(company.game, company)

        return Response({"companyID": company.id}, status=201)


class PostSpendingsView(APIView):

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        last_turn = get_last_turn(company.game)
        try:
            company_state = CompaniesState.objects.get(turn=last_turn, company=company)
        except CompaniesState.DoesNotExist:
            return Response({"detail": "Company state for this turn does not exist"}, status=500)

        if company_state.commited:
            return Response({"detail": "Decisions were posted before"}, status=409)

        print(company_state.marketing.viral, company_state.turn.number)

        spendings_serializer = SpendingsSerializer(data=request.data)
        spendings_serializer.is_valid(raise_exception=True)

        prod_serializer = ProductionSerializer(company_state.production, data=request.data['production'])
        prod_serializer.is_valid(raise_exception=True)


        factory_serializer = FactorySerializer(company_state.factory, data=request.data['factory'])
        factory_serializer.is_valid(raise_exception=True)


        marketing_serializer = MaketingSerializer(company_state.marketing, data=request.data['marketing'])
        marketing_serializer.is_valid(raise_exception=True)


        try:    brakes = request.data['brakes']
        except KeyError: brakes = 0
        try:    frame = request.data['frame']
        except KeyError: frame = 0
        try:    battery = request.data['battery']
        except KeyError: battery = 0
        try:    display = request.data['display']
        except KeyError: display = 0

        brakes_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Brakes"))
        if brakes > 0:
            if brakes_progress.status == "f":
                return Response({"detail": "Brakes are already finished"}, status=409)
            if brakes_progress.progress == 0:
                brakes_progress.status = "s"
            brakes_progress.progress = brakes_progress.progress + brakes
            if brakes_progress.progress >= Upgrade.objects.get(name="Brakes").cost:
                brakes_progress.status = "f"
                brakes_progress.turn = company_state.turn
            

        frame_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Frame"))
        if frame > 0:
            if frame_progress.status == "f":
                return Response({"detail": "Frame is already finished"}, status=409)
            if frame_progress.progress == 0:
                frame_progress.status = "s"
            frame_progress.progress = frame_progress.progress + frame
            if frame_progress.progress >= Upgrade.objects.get(name="Frame").cost:
                frame_progress.status = "f"
                frame_progress.turn = company_state.turn
            

        battery_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Battery"))
        if battery > 0:
            if battery_progress.status == "f":
                return Response({"detail": "Battery is already finished"}, status=409)
            if battery_progress.progress == 0:
                battery_progress.status = "s"
            battery_progress.progress = battery_progress.progress + battery
            if battery_progress.progress >= Upgrade.objects.get(name="Battery").cost:
                battery_progress.status = "f"
                battery_progress.turn = company_state.turn
            

        display_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Display"))
        if display > 0:
            if display_progress.status == "f":
                return Response({"detail": "Display is already finished"}, status=409)
            if display_progress.progress == 0:
                display_progress.status = "s"
            display_progress.progress = display_progress.progress + display
            if display_progress.progress >= Upgrade.objects.get(name="Display").cost:
                display_progress.status = "f"
                display_progress.turn = company_state.turn

        production = prod_serializer.save()
        production.save()
        company_state.production = production

        factory = factory_serializer.save()
        factory.save()
        company_state.factory = factory

        marketing = marketing_serializer.save()
        marketing.save()
        company_state.marketing = marketing

        brakes_progress.save()
        frame_progress.save()
        battery_progress.save()
        display_progress.save()

        company_state.r_d = brakes + frame + battery + display
        company_state.commited = True
        company_state.save()

        return Response(status=201)


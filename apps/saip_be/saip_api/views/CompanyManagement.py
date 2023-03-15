from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn, CompaniesUpgrades, MarketState

from ..serializers import CompanySerializer, ProductionSerializer, SpendingsSerializer, MaketingSerializer, FactorySerializer

from .GameManagement import get_last_turn, create_company_state, end_turn


from django.core import serializers


from saip_simulation.simulation import Simulation
from django.utils import timezone
from .GameManagement import create_turn, calculate_man_cost


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

class IndustryReport(APIView):

    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        last_turn = get_last_turn(company.game)
        company_states = CompaniesState.objects.filter(turn=last_turn)
        market_state = MarketState.objects.get(turn=last_turn)

        industry = dict()
        for state in company_states:
            company_info = dict()
            company_info['stock_price'] = state.stock_price
            company_info['sell_price'] = state.production.sell_price
            company_info['net_profit'] = state.net_profit
            company_info['market_share'] = state.orders_fulfilled/market_state.sold

            industry[state.company.name] = company_info

        market_state = MarketState.objects.get(turn=last_turn)
        market = dict()
        market['sold_products'] = market_state.sold
        market['demand'] = market_state.demand
        market['inventory'] = market_state.inventory


        return Response({"industry": industry, "market": market}, status=200)


class CompanyReport(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        last_turn = get_last_turn(company.game)
        #company_state = CompaniesState.objects.get(turn=last_turn, company=company)
        
        company_state_previous = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=last_turn.number-1), company=company)
        marketing = company_state_previous.marketing.billboard + company_state_previous.marketing.tv + company_state_previous.marketing.viral + company_state_previous.marketing.podcast + company_state_previous.marketing.ooh

        production = dict()
        production['production'] = company_state_previous.production.volume
        production['capacity'] = company_state_previous.factory.capacity
        production['utilization'] = (company_state_previous.production.volume/company_state_previous.factory.capacity)*100
        production['man_cost'] = company_state_previous.production.man_cost
        production['new_inventory'] = company_state_previous.inventory
        production['selling_price'] = company_state_previous.production.sell_price

        sales = dict()
        sales['orders_received'] = company_state_previous.orders_received
        sales['orders_fulfilled'] = company_state_previous.orders_fulfilled
        sales['orders_unfulfilled'] = company_state_previous.orders_received - company_state_previous.orders_fulfilled
        sales['selling_price'] = company_state_previous.production.sell_price

        balance = dict()
        balance['cash'] = company_state_previous.cash
        balance['inventory_money'] = company_state_previous.inventory * company_state_previous.production.man_cost
        balance['capital_investments'] = company_state_previous.capital_invesments

        #pasiva
        balance['loans'] = company_state_previous.loans
        balance['ret_earnings'] = company_state_previous.ret_earnings
        balance['base_capital'] = company.game.parameters.base_capital

        cash_flow = dict()
        cash_flow['beginning_cash'] = CompaniesState.objects.get(turn=Turn.objects.get(number=last_turn.number-2), company=company).cash #???
        cash_flow['sales'] =  company_state_previous.sales #plus
        cash_flow['sold_man_cost'] = company_state_previous.sold_man_cost #minus
        # vydavky na rozhodnutia - zratane vydavky na marketing r_d a capital s minusovou hodnotou
        cash_flow['expenses'] = company_state_previous.r_d + marketing + company_state_previous.capital
        cash_flow['interest'] = company_state_previous.interest # minus
        cash_flow['tax'] = company_state_previous.tax # minus
        # teraz bude stav cash flow aby vedeli či potrebuju pozicku
        cash_flow['cash_flow_result'] = company_state_previous.cash_flow_res

        #teraz ak je minus tak novy ubver alebo ak nie tak spatenie uveru
        cash_flow['new_loans'] = company_state_previous.new_loans
        cash_flow['loan_repayment'] = company_state_previous.loan_repayment
         
        #zostatok do dalssieho prostredia
        cash_flow['cash'] = company_state_previous.cash

        income_statement = dict()
        income_statement['sales'] = company_state_previous.sales
        income_statement['sold_man_cost'] = company_state_previous.sold_man_cost
        income_statement['marketing'] = marketing
        income_statement['r_d'] = company_state_previous.r_d
        income_statement['depreciation'] = company_state_previous.depreciation
        income_statement['inventory_charge'] = company_state_previous.inventory_charge # minus
        income_statement['interest'] = company_state_previous.interest
        income_statement['profit_before_tax'] = company_state_previous.profit_before_tax
        income_statement['tax'] = company_state_previous.tax
        income_statement['net_profit'] = company_state_previous.net_profit #???


        return Response({"production": production, "sales": sales, 'balance': balance, 'cash_flow': cash_flow, 'income_statement': income_statement}, status=200)
  

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
        
        turn = Turn.objects.get(game=company.game, number=0)
        create_company_state(company, turn)

        return Response({"companyID": company.id}, status=201)

def checkCommitted(turn: Turn, end: bool = True) -> bool:
    states = CompaniesState.objects.filter(turn=turn)

    for company in states:
        if not company.committed:
            return False

    if end:
        end_turn(turn)
    
    return True


class Committed(APIView):

    def get(self, request) -> Response:

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

        return Response({"committed": company_state.committed}, status=200)

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

        if company_state.committed:
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
        company_state.committed = True
        company_state.save()

        checkCommitted(last_turn)

        return Response(status=201)

class TurnInfoView(APIView):
    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)
        
        turn = get_last_turn(company.game)

        return Response({"Number": turn.number, "Start": turn.start})

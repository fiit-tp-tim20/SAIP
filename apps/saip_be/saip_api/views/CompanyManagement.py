from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn, CompaniesUpgrades, MarketState, TeacherDecisions

from ..serializers import CompanySerializer, ProductionSerializer, SpendingsSerializer, MaketingSerializer, FactorySerializer

from .GameManagement import get_last_turn, create_company_state, end_turn


from django.core import serializers


from saip_simulation.simulation import Simulation
from django.utils import timezone
from .GameManagement import create_turn, calculate_man_cost

class MarketingView(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        marketing = [None] * (company.game.turns - 1)
        for turn_num in range(company.game.turns - 1):
            print(turn_num)
            try:
                state = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=turn_num+1), company=company)
                marketing[turn_num] = state.orders_received
            except (CompaniesState.DoesNotExist, Turn.DoesNotExist):
                 continue

        return Response({"demand": marketing}, status=200)

    
class CompanyView(APIView):

    def get(self, request) -> Response:
        
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        manufactured = [None] * (company.game.turns - 1)
        sold = [None] * (company.game.turns - 1)

        for turn_num in range(company.game.turns - 1):
            try:
                state = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=turn_num+1), company=company)
                manufactured[turn_num] = state.production.volume
                sold[turn_num] = state.orders_fulfilled
            except (CompaniesState.DoesNotExist, Turn.DoesNotExist):
                continue

        return Response({"manufactured": manufactured, "sold": sold}, status=200)


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

        last_turn = get_last_turn(company.game)
        company_state = CompaniesState.objects.get(turn=last_turn, company=company)

        if company_state.cash >= 10000:
            print(company_state.cash)
            budget = 10000
        else:
            budget = company_state.cash

        return Response({"id": company.id, 'name': company.name, 'budget_cap': budget}, status=200)

class IndustryReport(APIView):

    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        last_turn = get_last_turn(company.game)
        company_states = CompaniesState.objects.filter(turn=Turn.objects.get(game=company.game, number=last_turn.number-1))
        market_state = MarketState.objects.get(turn=Turn.objects.get(game=company.game, number=last_turn.number-1))

        industry = dict()
        for state in company_states:
            company_info = dict()
            company_info['stock_price'] = state.stock_price
            company_info['sell_price'] = state.production.sell_price
            company_info['net_profit'] = state.net_profit
            try:
                company_info['market_share'] = (state.orders_fulfilled/market_state.sold)*100
            except ZeroDivisionError:
                company_info['market_share'] = 0

            industry[state.company.name] = company_info

        market_state_previous = MarketState.objects.get(turn=Turn.objects.get(game=company.game, number=last_turn.number-2))
        
        market = dict()
        market['demand'] = market_state.demand
        try:
            market['demand_difference'] = round(((market_state.demand/market_state_previous.demand) - 1)*100, 2)
        except ZeroDivisionError:
            market['demand_difference'] = "N/A"
        market['sold_products'] = market_state.sold
        try:
            market['sold_products_difference'] = round(((market_state.sold/market_state_previous.sold) - 1)*100, 2)
        except ZeroDivisionError:
            market['sold_products_difference'] ="N/A"
        market['manufactured'] = market_state.manufactured
        try:
            market['manufactured_difference'] = round(((market_state.manufactured/market_state_previous.manufactured) - 1)*100, 2)
        except ZeroDivisionError:
            market['manufactured_difference'] = "N/A"
        market['capacity'] = market_state.capacity
        try:
            market['capacity_difference'] = round(((market_state.capacity/market_state_previous.capacity) - 1)*100, 2)
        except ZeroDivisionError:
            market['capacity_difference'] = "N/A"
        market['inventory'] = market_state.inventory
        print(market_state.inventory)
        try:
            market['inventory_difference'] = round(((market_state.inventory/market_state_previous.inventory) - 1)*100, 2)
        except ZeroDivisionError:
            market['inventory_difference'] = "N/A"

        teacher_decisions = TeacherDecisions.objects.get(turn = Turn.objects.get(game=company.game, number=last_turn.number-1))
        teacher_decisions_previous = TeacherDecisions.objects.get(turn = Turn.objects.get(game=company.game, number=last_turn.number-2))
        economic_parameters = dict()
        economic_parameters['interest_rate'] = teacher_decisions.interest_rate * 100
        try:
            economic_parameters['interest_rate_difference'] = round(((teacher_decisions.interest_rate/teacher_decisions_previous.interest_rate) - 1)*100, 2)
        except ZeroDivisionError:
            economic_parameters['interest_rate_difference'] = "N/A"
        economic_parameters['tax_rate'] = teacher_decisions.tax_rate * 100
        try:
            economic_parameters['tax_rate_difference'] = round(((teacher_decisions.tax_rate/teacher_decisions_previous.tax_rate) - 1)*100, 2)
        except ZeroDivisionError:
            economic_parameters['tax_rate_difference'] = "N/A"
        economic_parameters['inflation'] = teacher_decisions.inflation * 100
        try:
            economic_parameters['inflation_difference'] = round(((teacher_decisions.inflation/teacher_decisions_previous.inflation) - 1)*100, 2)
        except ZeroDivisionError:
            economic_parameters['inflation_difference'] = "N/A"
        economic_parameters['loan_limit'] = teacher_decisions.loan_limit * 100
        try:
            economic_parameters['loan_limit_difference'] = round(((teacher_decisions.loan_limit/teacher_decisions_previous.loan_limit) - 1)*100, 2)
        except ZeroDivisionError:
            economic_parameters['loan_limit_difference'] = "N/A"

        return Response({"industry": industry, "market": market, "economic_parameters": economic_parameters}, status=200)


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
        production['man_cost_all'] = company_state_previous.production.man_cost_all

        sales = dict()
        sales['orders_received'] = company_state_previous.orders_received
        sales['orders_fulfilled'] = company_state_previous.orders_fulfilled
        sales['orders_unfulfilled'] = company_state_previous.orders_received - company_state_previous.orders_fulfilled
        sales['selling_price'] = company_state_previous.production.sell_price

        balance = dict()
        balance['cash'] = company_state_previous.cash
        balance['inventory_money'] = company_state_previous.inventory * company_state_previous.production.man_cost
        balance['capital_investments'] = company_state_previous.factory.capital_investments
        balance['assets_summary'] = company_state_previous.cash + company_state_previous.inventory * company_state_previous.production.man_cost + company_state_previous.factory.capital_investments

        #pasiva
        balance['loans'] = company_state_previous.loans
        balance['ret_earnings'] = company_state_previous.ret_earnings
        balance['base_capital'] = company.game.parameters.base_capital
        balance['liabilities_summary'] = company_state_previous.loans + company_state_previous.ret_earnings + company.game.parameters.base_capital

        cash_flow = dict()
        cash_flow['beginning_cash'] = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=last_turn.number-2), company=company).cash #???
        cash_flow['sales'] =  company_state_previous.sales #plus
        cash_flow['manufactured_man_cost'] = company_state_previous.manufactured_man_cost #minus
        # vydavky na rozhodnutia - zratane vydavky na marketing r_d a capital s minusovou hodnotou
        cash_flow['inventory_charge'] = company_state_previous.inventory_charge 
        cash_flow['expenses'] = company_state_previous.r_d + marketing + company_state_previous.factory.capital
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
        income_statement['manufactured_man_cost'] = company_state_previous.manufactured_man_cost
        income_statement['marketing'] = marketing
        income_statement['r_d'] = company_state_previous.r_d
        income_statement['depreciation'] = company_state_previous.depreciation
        income_statement['inventory_charge'] = company_state_previous.inventory_charge # minus
        income_statement['inventory_upgrade'] = company_state_previous.inventory_upgrade
        income_statement['overcharge_upgrade'] = company_state_previous.overcharge_upgrade
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
    auto_end = turn.game.parameters.end_turn_on_committed

    for company in states:
        if not company.committed:
            return False

    if end and auto_end:
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

import math

from rest_framework.views import APIView
from rest_framework.response import Response
from saip_ws.triggers import broadcast_message
from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn, CompaniesUpgrades, \
    MarketState, TeacherDecisions
from ..serializers import CompanySerializer, ProductionSerializer, SpendingsSerializer, MaketingSerializer, \
    FactorySerializer

from .GameManagement import get_last_turn, create_company_state, end_turn

from django.core import serializers

from saip_simulation.simulation import Simulation
from django.utils import timezone
from .GameManagement import create_turn, calculate_man_cost


class IndustryView(APIView):
    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        rank = [None] * (company.game.turns - 1)
        stock_price = [None] * (company.game.turns - 1)
        last_turn = get_last_turn(company.game)

        for turn_num in range(last_turn.number - 1):
            state = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=turn_num + 1),
                                               company=company)
            stock_price[turn_num] = state.stock_price

            ordered_states = list(
                CompaniesState.objects.filter(turn=Turn.objects.get(game=company.game, number=turn_num + 1)).order_by(
                    '-stock_price'))

            for index, one in enumerate(ordered_states):
                if one.company == company:
                    rank[turn_num] = index + 1

        return Response({"num_players": len(ordered_states), "rank": rank, "stock_price": stock_price}, status=200)


class MarketingView(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        marketing = {'demand': [],
                     'volume': [],
                     'orders_fulfilled': []
                     }
        last_turn = get_last_turn(company.game)
        for turn_num in range(last_turn.number - 1):
            state = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=turn_num + 1),
                                               company=company)
            marketing['demand'].append(state.orders_received)
            marketing['volume'].append(state.production.volume)
            marketing['orders_fulfilled'].append(state.orders_fulfilled)

        return Response({"stats": marketing}, status=200)


class CompanyView(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        manufactured = [None] * (company.game.turns - 1)
        inventory = [None] * (company.game.turns - 1)
        capacity = [None] * (company.game.turns - 1)
        sell_price = [None] * (company.game.turns - 1)

        last_turn = get_last_turn(company.game)
        for turn_num in range(last_turn.number - 1):
            try:
                state = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=turn_num + 1),
                                                   company=company)
                manufactured[turn_num] = state.production.volume
                inventory[turn_num] = state.inventory
                capacity[turn_num] = state.factory.capacity
                sell_price[turn_num] = state.production.sell_price
            except (CompaniesState.DoesNotExist, Turn.DoesNotExist):
                continue

        return Response(
            {"manufactured": manufactured, "inventory": inventory, "capacity": capacity, "sell_price": sell_price},
            status=200)


def create_upgrade_company_relation(game: Game, company: Company) -> None:
    """Creates a relation between a company and all the upgrades in the game"""
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
        previous_turn = Turn.objects.get(game=company.game, number=last_turn.number - 1)
        company_state = CompaniesState.objects.get(turn=previous_turn, company=company)
        teacher_decisions = TeacherDecisions.objects.get(turn=previous_turn)

        bonus_spendable_cash = 0
        if company_state.cash > 10000:
            bonus_spendable_cash = company_state.cash * teacher_decisions.bonus_spendable_cash_increase_rate

        if company_state.cash >= 10000:
            budget = 10000
        elif company_state.cash < 0:
            budget = 0
        else:
            budget = company_state.cash
        return Response(
            {
                "id": company.id,
                'name': company.name,
                'budget_cap': budget,
                'bonus_spendable_cash': math.floor(bonus_spendable_cash)
            }, status=200)


class IndustryReport(APIView):

    def get(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        try:
            turn = Turn.objects.get(game=company.game, number=request.GET.get("turn"))
        except Turn.DoesNotExist:
            return Response({"detail": "Turn not found"}, status=404)

        # last_turn = get_last_turn(company.game)

        company_states = CompaniesState.objects.filter(turn=Turn.objects.get(game=company.game, number=turn.number))
        market_state = MarketState.objects.get(turn=Turn.objects.get(game=company.game, number=turn.number))
        companies = Company.objects.filter(game=company.game)
        upgrades = []
        for i in companies:
            upgrade_names = ["Brakes", "Frame", "Battery", "Display"]
            upgrade = 0
            for j in upgrade_names:

                upgrade_turn = CompaniesUpgrades.objects.get(company=i, upgrade=Upgrade.objects.get(name=j))
                if upgrade_turn.status == 'f':
                    upgrade += 1
            upgrades.append(upgrade)

        industry = dict()
        for state, finished_upgrade in zip(company_states, upgrades):
            company_info = dict()
            company_info['stock_price'] = round(state.stock_price, 2) if state.stock_price is not None else "N/A"
            company_info[
                'sell_price'] = state.production.sell_price if state.production.sell_price is not None else "N/A"
            company_info['net_profit'] = round(state.net_profit, 2) if state.net_profit is not None else "N/A"
            try:
                company_info['market_share'] = round((state.orders_fulfilled / market_state.sold) * 100, 2)
            except (ZeroDivisionError, TypeError):
                company_info['market_share'] = 0
            company_info['finished_upgrades'] = finished_upgrade
            industry[state.company.name] = company_info

        market_state_previous = MarketState.objects.get(
            turn=Turn.objects.get(game=company.game, number=turn.number - 1))

        market = dict()
        market['demand'] = market_state.demand
        try:
            market['demand_difference'] = round(((market_state.demand / market_state_previous.demand) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            market['demand_difference'] = "N/A"
        market['sold_products'] = market_state.sold
        try:
            market['sold_products_difference'] = round(((market_state.sold / market_state_previous.sold) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            market['sold_products_difference'] = "N/A"
        market['manufactured'] = market_state.manufactured
        try:
            market['manufactured_difference'] = round(
                ((market_state.manufactured / market_state_previous.manufactured) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            market['manufactured_difference'] = "N/A"
        market['capacity'] = market_state.capacity
        try:
            market['capacity_difference'] = round(((market_state.capacity / market_state_previous.capacity) - 1) * 100,
                                                  2)
        except (ZeroDivisionError, TypeError):
            market['capacity_difference'] = "N/A"
        market['inventory'] = market_state.inventory
        print(market_state.inventory)
        try:
            market['inventory_difference'] = round(
                ((market_state.inventory / market_state_previous.inventory) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            market['inventory_difference'] = "N/A"

        teacher_decisions = TeacherDecisions.objects.get(turn=Turn.objects.get(game=company.game, number=turn.number))
        teacher_decisions_previous = TeacherDecisions.objects.get(
            turn=Turn.objects.get(game=company.game, number=turn.number - 1))
        economic_parameters = dict()
        economic_parameters['interest_rate'] = teacher_decisions.interest_rate * 100
        try:
            economic_parameters['interest_rate_difference'] = round(
                ((teacher_decisions.interest_rate / teacher_decisions_previous.interest_rate) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            economic_parameters['interest_rate_difference'] = "N/A"
        economic_parameters['tax_rate'] = teacher_decisions.tax_rate * 100
        try:
            economic_parameters['tax_rate_difference'] = round(
                ((teacher_decisions.tax_rate / teacher_decisions_previous.tax_rate) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            economic_parameters['tax_rate_difference'] = "N/A"
        economic_parameters['inflation'] = teacher_decisions.inflation * 100
        try:
            economic_parameters['inflation_difference'] = round(
                ((teacher_decisions.inflation / teacher_decisions_previous.inflation) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            economic_parameters['inflation_difference'] = "N/A"
        economic_parameters['loan_limit'] = teacher_decisions.loan_limit
        try:
            economic_parameters['loan_limit_difference'] = round(
                ((teacher_decisions.loan_limit / teacher_decisions_previous.loan_limit) - 1) * 100, 2)
        except (ZeroDivisionError, TypeError):
            economic_parameters['loan_limit_difference'] = "N/A"

        return Response({"industry": industry, "market": market, "economic_parameters": economic_parameters},
                        status=200)


class ArchiveReport(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        try:
            turn = Turn.objects.get(game=company.game, number=request.GET.get("turn"))
        except Turn.DoesNotExist:
            return Response({"detail": "Turn not found"}, status=404)

        marketing_dict = {'tv': [],
                          'viral': [],
                          'billboard': [],
                          'ooh': [],
                          'podcast': []
                          }
        factory_dict = {'capital': [],
                        'upgrades': [],
                        'upgrade_turn': [' '] * turn.number
                        }
        production_dict = {'volume': [],
                           'man_cost': [],
                           'man_cost_all': [],
                           'sell_price': [],
                           }
        sales = {'orders_received': [],
                 'orders_fulfilled': [],
                 'orders_unfulfilled': [],
                 }
        balance = {'cash': [],
                   'inventory_money': [],
                   'assets_summary': [],
                   'loans': [],
                   'ret_earnings': [],
                   'base_capital': [],
                   'liabilities_summary': [],
                   'capital_investments': [],
                   }
        income_statement = {'sales': [],  # "Tržby z predaja výrobkov"
                            'manufactured_man_cost': [],  # "Náklady na predaný tovar"
                            'r_d': [],  # "Náklady na výskum a vývoj"
                            'depreciation': [],  # "Odpisy"
                            'inventory_charge': [],  # minus #"Dodatočné náklady na nepredané výrobky"
                            'inventory_upgrade': [],  # "Náklady na upgrade zásob"
                            'overcharge_upgrade': [],  # "Náklady na precenenie zásob"
                            'interest': [],  # "Nákladové úroky"
                            'profit_before_tax': [],  # "Výsledok hospodárenia pred zdanením"
                            'tax': [],  # "Daň"
                            'net_profit': []}  # "Výsledok hospodárenia po zdanení"

        cash_flow = {'sales': [],
                     'manufactured_man_cost': [],
                     'inventory_charge': [],
                     'interest': [],
                     'tax': [],
                     'cash_flow_result': [],
                     'new_loans': [],
                     'loan_repayment': [],
                     'cash': []}
        upgrade_names = ["Brakes", "Frame", "Battery", "Display"]
        for i in upgrade_names:
            upgrade_turn = CompaniesUpgrades.objects.get(company=company, upgrade=Upgrade.objects.get(name=i))
            if upgrade_turn.status == 'f':
                turn_u = upgrade_turn.turn.number
                if len(factory_dict['upgrade_turn']) > turn_u-1:
                    factory_dict['upgrade_turn'][turn_u - 1] = i
        for i in range(1, turn.number + 1):
            company_state_new = CompaniesState.objects.get(
                turn=Turn.objects.get(game=company.game, number=i), company=company)
            factory_dict['capital'].append(company_state_new.factory.capital)
            factory_dict['upgrades'].append(company_state_new.r_d)
            production_dict['volume'].append(company_state_new.production.volume)
            production_dict['man_cost'].append(round(company_state_new.production.man_cost, 2))
            production_dict['man_cost_all'].append(round(company_state_new.production.man_cost_all, 2))
            production_dict['sell_price'].append(company_state_new.production.sell_price)
            marketing_dict['tv'].append(company_state_new.marketing.tv)
            marketing_dict['viral'].append(company_state_new.marketing.viral)
            marketing_dict['billboard'].append(company_state_new.marketing.billboard)
            marketing_dict['ooh'].append(company_state_new.marketing.ooh)
            marketing_dict['podcast'].append(company_state_new.marketing.podcast)
            sales['orders_received'].append(company_state_new.orders_received)  # "Prijaté objednávky"
            sales['orders_fulfilled'].append(company_state_new.orders_fulfilled)  # "Splnené objednávky"
            sales['orders_unfulfilled'].append(
                (company_state_new.orders_received - company_state_new.orders_fulfilled))  # Nesplnené objednávky
            balance['cash'].append(round(company_state_new.cash, 2))
            balance['inventory_money'].append(round(company_state_new.inventory_money, 2))
            balance['assets_summary'].append(round((company_state_new.cash + (
                    company_state_new.inventory * company_state_new.production.man_cost) +
                                                    company_state_new.factory.capital_investments), 2))  # pasiva
            balance['loans'].append(round(company_state_new.loans, 2))  # "Pôžičky"
            balance['ret_earnings'].append(round(company_state_new.ret_earnings, 2))  # "Výsledok hospodárenia z
            # predchádzajúcich období"
            balance['base_capital'].append(round(company.game.parameters.base_capital, 2))  # "Základné ímanie"
            balance['liabilities_summary'].append(round(
                company_state_new.loans + company_state_new.ret_earnings + company.game.parameters.base_capital,
                2))  # "Súčet pasív"
            balance['capital_investments'].append(round(company_state_new.factory.capital_investments, 2))
            # income_statement['sales'].append(round(company_state_new.sales, 2))
            # income_statement['manufactured_man_cost'].append(round(company_state_new.sold_man_cost, 2))
            # income_statement['r_d'].append(round(company_state_new.r_d, 2))
            # income_statement['depreciation'].append(round(company_state_new.depreciation, 2))
            # income_statement['inventory_charge'].append(round(company_state_new.inventory_charge, 2))
            # income_statement['inventory_upgrade'].append(round(company_state_new.inventory_upgrade, 2))
            # income_statement['overcharge_upgrade'].append(round(company_state_new.overcharge_upgrade, 2))
            # income_statement['interest'].append(round(company_state_new.interest, 2))
            # income_statement['profit_before_tax'].append(round(company_state_new.profit_before_tax, 2))
            # income_statement['tax'].append(round(company_state_new.tax, 2))
            # income_statement['net_profit'].append(round(company_state_new.net_profit, 2))
            # cash_flow['sales'].append(round(company_state_new.sales, 2))
            # cash_flow['manufactured_man_cost'].append(round(company_state_new.manufactured_man_cost, 2))
            # cash_flow['inventory_charge'].append(round(company_state_new.inventory_charge, 2))
            # cash_flow['interest'].append(round(company_state_new.interest, 2))
            # cash_flow['tax'].append(round(company_state_new.tax, 2))
            # cash_flow['cash_flow_result'].append(round(company_state_new.cash_flow_res, 2))
            # cash_flow['new_loans'].append(round(company_state_new.new_loans, 2))
            # cash_flow['loan_repayment'].append(round(company_state_new.loan_repayment, 2))
            # cash_flow['cash'].append(round(company_state_new.cash, 2))

        return Response({"marketing": marketing_dict, 'cash_flow': cash_flow, 'income_statement': income_statement,
                         'balance': balance, 'sales': sales, 'production': production_dict, 'factory': factory_dict}
                        , status=200)


class CompanyReport(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        try:
            turn = Turn.objects.get(game=company.game, number=request.GET.get("turn"))
        except Turn.DoesNotExist:
            return Response({"detail": "Turn not found"}, status=404)

        # last_turn = get_last_turn(company.game)
        # company_state = CompaniesState.objects.get(turn=last_turn, company=company)

        company_state_previous = CompaniesState.objects.get(
            turn=Turn.objects.get(game=company.game, number=turn.number), company=company)
        marketing = company_state_previous.marketing.billboard + company_state_previous.marketing.tv + company_state_previous.marketing.viral + company_state_previous.marketing.podcast + company_state_previous.marketing.ooh

        try:
            state2ago = CompaniesState.objects.get(turn=Turn.objects.get(game=company.game, number=turn.number - 1),
                                                   company=company)
        except (Turn.DoesNotExist, CompaniesState.DoesNotExist):
            state2ago = False

        production = dict()
        production['production'] = company_state_previous.production.volume  # "Vyrobené množstvo"
        production['capacity'] = company_state_previous.factory.capacity  # "Výrobná kapacita"
        if (state2ago):
            production['utilization'] = round(
                (company_state_previous.production.volume / state2ago.factory.capacity) * 100, 2)
        else:
            production['utilization'] = "N/A"
        # "Koeficient využitia výrobnej kapacity"
        production['man_cost'] = round(company_state_previous.production.man_cost,
                                       2) if company_state_previous.production.man_cost is not None else "N/A"  # "Variabilné náklady"
        production[
            'new_inventory'] = company_state_previous.inventory if company_state_previous.inventory is not None else "N/A"  # "Zásoby"
        production['man_cost_all'] = round(company_state_previous.production.man_cost_all,
                                           2) if company_state_previous.production.man_cost_all is not None else "N/A"  # "Celkové náklady"

        sales = dict()
        sales[
            'orders_received'] = company_state_previous.orders_received if company_state_previous.orders_received is not None else "N/A"  # "Prijaté objednávky"
        sales[
            'orders_fulfilled'] = company_state_previous.orders_fulfilled if company_state_previous.orders_fulfilled is not None else "N/A"  # "Splnené objednávky"
        sales['orders_unfulfilled'] = (
                company_state_previous.orders_received - company_state_previous.orders_fulfilled) if (
                company_state_previous.orders_fulfilled is not None and company_state_previous.orders_received is not None) else "N/A"  # Nesplnené objednávky
        sales[
            'selling_price'] = company_state_previous.production.sell_price if company_state_previous.production.sell_price is not None else "N/A"  # "Predajná cena"

        balance = dict()
        balance['cash'] = round(company_state_previous.cash,
                                2) if company_state_previous.cash is not None else "N/A"  # "Hotovosť" #TODO: CHANGED from cash to balance !!!!!MIND THE SUMMARY AS WELL
        # balance['inventory_money'] = round(
        #     (company_state_previous.inventory * company_state_previous.production.man_cost), 2) if (
        #         company_state_previous.inventory is not None and company_state_previous.production.man_cost is not None) else "N/A"  # Zásoby

        balance['inventory_money'] = round(company_state_previous.inventory_money, 2) if (
                company_state_previous.inventory is not None and company_state_previous.production.man_cost is not None) else "N/A"  # Zásoby

        balance['capital_investments'] = round(company_state_previous.factory.capital_investments,
                                               2) if company_state_previous.factory.capital_investments is not None else "N/A"  # "Kapitálové investície"
        balance['assets_summary'] = round((
                company_state_previous.cash + company_state_previous.inventory_money + company_state_previous.factory.capital_investments),
            2) if (
                company_state_previous.cash is not None and company_state_previous.inventory is not None and company_state_previous.production.man_cost is not None and company_state_previous.factory.capital_investments is not None) else "N/A"  # "Súčet aktív"

        # pasiva
        balance['loans'] = round(company_state_previous.loans,
                                 2) if company_state_previous.loans is not None else "N/A"  # "Pôžičky"
        balance['ret_earnings'] = round(company_state_previous.ret_earnings,
                                        2) if company_state_previous.ret_earnings is not None else "N/A"  # "Výsledok hospodárenia z predchádzajúcich období"
        balance['base_capital'] = round(company.game.parameters.base_capital,
                                        2) if company.game.parameters.base_capital is not None else "N/A"  # "Základné ímanie"
        balance['liabilities_summary'] = round(
            company_state_previous.loans + company_state_previous.ret_earnings + company.game.parameters.base_capital,
            2) if (
                company_state_previous.loans is not None and company_state_previous.ret_earnings is not None and company.game.parameters.base_capital is not None) else "N/A"  # "Súčet pasív"

        cash_flow = dict()
        try:
            tmp_beginning_cash = CompaniesState.objects.get(
                turn=Turn.objects.get(game=company.game, number=turn.number - 1), company=company).cash
            cash_flow['beginning_cash'] = round(tmp_beginning_cash,
                                                2) if tmp_beginning_cash is not None else "N/A"  # ???
        except (Turn.DoesNotExist, CompaniesState.DoesNotExist):
            tmp_beginning_cash = CompaniesState.objects.get(
                turn=Turn.objects.get(game=company.game, number=turn.number), company=company).cash
            cash_flow['beginning_cash'] = round(tmp_beginning_cash,
                                                2) if tmp_beginning_cash is not None else "N/A"  # ???
            # "Počiatočný stav"

        cash_flow['sales'] = round(company_state_previous.sales,
                                   2) if company_state_previous.sales is not None else "N/A"  # plus #"Príjmy z predaja výrobkov"
        cash_flow['manufactured_man_cost'] = round(company_state_previous.manufactured_man_cost,
                                                   2) if company_state_previous.manufactured_man_cost is not None else "N/A"  # minus #"Výdavky na vyrobené výrobky"
        # vydavky na rozhodnutia - zratane vydavky na marketing r_d a capital s minusovou hodnotou
        cash_flow['inventory_charge'] = round(company_state_previous.inventory_charge,
                                              2) if company_state_previous.inventory_charge is not None else "N/A"  # Dodatočné náklady na nepredané výrobky
        cash_flow['inventory_charge_all'] = round(company_state_previous.inventory_charge + company_state_previous.inventory_upgrade,2) if (company_state_previous.inventory_charge is not None and company_state_previous.inventory_upgrade is not None) else "N/A"  # "Výdavky na zásoby"

        cash_flow['expenses'] = round(company_state_previous.r_d + marketing + company_state_previous.factory.capital,
                                      2) if (
                company_state_previous.r_d is not None and marketing is not None and company_state_previous.factory.capital is not None) else "N/A"  # "Výdavky na rozhodnutia" #TODO: change to company.decision_costs - add it to model
        cash_flow['interest'] = round(company_state_previous.interest,
                                      2) if company_state_previous.interest is not None else "N/A"  # minus #"Výdavky na úroky"
        cash_flow['tax'] = round(company_state_previous.tax,
                                 2) if company_state_previous.tax is not None else "N/A"  # minus # "Zaplatená daň"
        # teraz bude stav cash flow aby vedeli či potrebuju pozicku›
        cash_flow['cash_flow_result'] = round(company_state_previous.cash_flow_res,
                                              2) if company_state_previous.cash_flow_res is not None else "N/A"  # "Výsledok finančného toku"

        # teraz ak je minus tak novy ubver alebo ak nie tak spatenie uveru
        cash_flow['new_loans'] = round(company_state_previous.new_loans,
                                       2) if company_state_previous.new_loans is not None else "N/A"  # "Nové úvery"
        cash_flow['loan_repayment'] = round(company_state_previous.loan_repayment,
                                            2) if company_state_previous.loan_repayment is not None else "N/A"  # "Splátka úveru"

        # zostatok do dalssieho prostredia
        cash_flow['cash'] = round(company_state_previous.cash,
                                  2) if company_state_previous.cash is not None else "N/A"  # "Konecny stav" #CHANGED after balance became cash

        income_statement = dict()
        income_statement['sales'] = round(company_state_previous.sales,
                                          2) if company_state_previous.sales is not None else "N/A"  # "Tržby z predaja výrobkov"
        income_statement['manufactured_man_cost'] = round(company_state_previous.sold_man_cost,
                                                          2) if company_state_previous.sold_man_cost is not None else "N/A"  # "Náklady na predaný tovar" #TODO: pridal som do modelov hodnotu sold_man_cost - mozno by bolo dobre zmenit aj nazov tejto hodnoty v dictionary na nieco ine ako manufactured_man_cost kedze to je nazov ineho atributu - to treba potom aj na FE, zmenit z coho to taha, preto to sem pisem
        income_statement['marketing'] = round(marketing,
                                              2) if marketing is not None else "N/A"  # "Náklady na marketing"
        income_statement['r_d'] = round(company_state_previous.r_d,
                                        2) if company_state_previous.r_d is not None else "N/A"  # "Náklady na výskum a vývoj"
        income_statement['depreciation'] = round(company_state_previous.depreciation,
                                                 2) if company_state_previous.depreciation is not None else "N/A"  # "Odpisy"
        income_statement['inventory_charge'] = round(company_state_previous.inventory_charge,
                                                     2) if company_state_previous.inventory_charge is not None else "N/A"  # minus #"Dodatočné náklady na nepredané výrobky"
        income_statement['inventory_upgrade'] = round(company_state_previous.inventory_upgrade,
                                                      2) if company_state_previous.inventory_upgrade is not None else "N/A"  # "Náklady na upgrade zásob"
        income_statement['overcharge_upgrade'] = round(company_state_previous.overcharge_upgrade,
                                                       2) if company_state_previous.inventory_upgrade is not None else "N/A"  # "Náklady na precenenie zásob"
        income_statement['interest'] = round(company_state_previous.interest,
                                             2) if company_state_previous.interest is not None else "N/A"  # "Nákladové úroky"
        income_statement['profit_before_tax'] = round(company_state_previous.profit_before_tax,
                                                      2) if company_state_previous.profit_before_tax is not None else "N/A"  # "Výsledok hospodárenia pred zdanením"
        income_statement['tax'] = round(company_state_previous.tax,
                                        2) if company_state_previous.tax is not None else "N/A"  # "Daň"
        income_statement['net_profit'] = round(company_state_previous.net_profit,
                                               2) if company_state_previous.net_profit is not None else "N/A"  # "Výsledok hospodárenia po zdanení"

        return Response({"production": production, "sales": sales, 'balance': balance, 'cash_flow': cash_flow,
                         'income_statement': income_statement}, status=200)


class CreateCompanyView(APIView):

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        # Check if a company model already exists for the user
        existing_company = Company.objects.filter(user=request.user).first()
        if existing_company:
            return Response({"detail": "Company already exists for this user"},
                            status=409)

        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company = serializer.save()

        company.user = request.user
        company.save()

        create_upgrade_company_relation(company.game, company)

        turn = Turn.objects.get(game=company.game, number=0)
        create_company_state(company, turn)

        return Response({"companyID": company.id}, status=201)


def checkCommitted(turn: Turn, game_name: str, end: bool = True) -> bool:
    """Checks of all companies are committed and ends turn if auto_end is set to True"""
    states = CompaniesState.objects.filter(turn=turn)
    auto_end = turn.game.parameters.end_turn_on_committed

    for company in states:
        if not company.committed:
            return False

    if end and auto_end:
        new_turn = end_turn(turn)
        y = {"Number": new_turn.number, "Committed": False}
        broadcast_message(y, game_name)  # toto je v poriadku, vsetkym pride sprava o tom, ze je nove kolo

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

        spendings_serializer = SpendingsSerializer(data=request.data)
        spendings_serializer.is_valid(raise_exception=True)

        prod_serializer = ProductionSerializer(company_state.production, data=request.data['production'])
        prod_serializer.is_valid(raise_exception=True)

        factory_serializer = FactorySerializer(company_state.factory, data=request.data['factory'])
        factory_serializer.is_valid(raise_exception=True)

        marketing_serializer = MaketingSerializer(company_state.marketing, data=request.data['marketing'])
        marketing_serializer.is_valid(raise_exception=True)

        try:
            brakes = request.data['brakes']
        except KeyError:
            brakes = 0
        try:
            frame = request.data['frame']
        except KeyError:
            frame = 0
        try:
            battery = request.data['battery']
        except KeyError:
            battery = 0
        try:
            display = request.data['display']
        except KeyError:
            display = 0
        brakes_progress = CompaniesUpgrades.objects.get(company=company, upgrade=Upgrade.objects.get(name="Brakes"))
        if brakes > 0:
            if brakes_progress.status == "f":
                return Response({"detail": "Brakes are already finished"}, status=409)
            if brakes_progress.progress == 0:
                brakes_progress.status = "s"
            brakes_progress.progress = brakes_progress.progress + brakes
            if brakes_progress.progress >= Upgrade.objects.get(name="Brakes").cost:
                brakes_progress.status = "f"
                brakes_progress.turn = company_state.turn

        frame_progress = CompaniesUpgrades.objects.get(company=company, upgrade=Upgrade.objects.get(name="Frame"))
        if frame > 0:
            if frame_progress.status == "f":
                return Response({"detail": "Frame is already finished"}, status=409)
            if frame_progress.progress == 0:
                frame_progress.status = "s"
            frame_progress.progress = frame_progress.progress + frame
            if frame_progress.progress >= Upgrade.objects.get(name="Frame").cost:
                frame_progress.status = "f"
                frame_progress.turn = company_state.turn

        battery_progress = CompaniesUpgrades.objects.get(company=company, upgrade=Upgrade.objects.get(name="Battery"))
        if battery > 0:
            if battery_progress.status == "f":
                return Response({"detail": "Battery is already finished"}, status=409)
            if battery_progress.progress == 0:
                battery_progress.status = "s"
            battery_progress.progress = battery_progress.progress + battery
            if battery_progress.progress >= Upgrade.objects.get(name="Battery").cost:
                battery_progress.status = "f"
                battery_progress.turn = company_state.turn

        display_progress = CompaniesUpgrades.objects.get(company=company, upgrade=Upgrade.objects.get(name="Display"))
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

        checkCommitted(last_turn, company.game.name)  # checks if all companies are committed

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
        state = CompaniesState.objects.get(turn=turn, company=company)

        return Response({"Number": turn.number, "Committed": state.committed})

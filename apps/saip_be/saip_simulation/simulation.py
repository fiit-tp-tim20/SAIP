import sys
from pathlib import Path
from typing import Dict

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]

if str(root) not in sys.path:
    sys.path.append(str(root))

# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError:  # Already removed
    pass

from saip_simulation.company import Company
from saip_simulation.market import Market
from saip_simulation.company import Factory
from saip_simulation.marketing import Billboard, SocialMedia, CableNews, Podcast, OOH, MarketingType
from saip_simulation.product import Product, LastingProduct, Upgrade

from saip_simulation.config import FactoryPreset, CompanyPreset
import saip_simulation.config as config

import saip_api.models as models


class Simulation:
    companies: Dict[str, Company]
    market: Market
    current_turn: int  # the current turn being evaluated
    turn_limit: int  # maximum number of turns

    def __init__(
        self,
        game_model: models.Game,
        turn_model: models.Turn,
        next_turn_model: models.Turn,
        prev_turn_model: models.Turn,
    ) -> None:

        self.companies = {}
        self.market = None
        self.game_model = game_model
        self.turn_model = turn_model
        self.next_turn_model = next_turn_model
        self.prev_turn_model = prev_turn_model
        self.current_turn = turn_model.number
        self.turn_limit = game_model.turns
        self.teacher_decisions = {}
        self.setup_simulation()

    def setup_simulation(self) -> None:
        # load teacher decisions
        try:
            teacher_decisions_model = models.TeacherDecisions.objects.get(
                turn=self.turn_model
            )
            self.teacher_decisions = {
                "interest_rate": teacher_decisions_model.interest_rate,
                "tax_rate": teacher_decisions_model.tax_rate,
                "inflation": teacher_decisions_model.inflation,
                "loan_limit": teacher_decisions_model.loan_limit,
            }
        except models.TeacherDecisions.DoesNotExist:
            self.teacher_decisions = {
                "interest_rate": CompanyPreset.DEFAULT_INTEREST_RATE,
                "tax_rate": CompanyPreset.DEFAULT_TAX_RATE,
                "inflation": FactoryPreset.BASE_INFLATION,
                "loan_limit": CompanyPreset.DEFAULT_LOAN_LIMIT,
            }
            pass

        # Filter companies that are in this game
        companies_models = models.Company.objects.filter(game=self.game_model)
        # iterate over the companies and create all relevant classes
        for company_model in companies_models:
            # add the company to the companies dictionary
            self.companies[company_model.name] = self.create_company(
                company_model=company_model
            )

        # setup the market attributes
        try:
            market_state_model = models.MarketState.objects.get(turn=self.turn_model)
            self.market = Market(
                companies=self.companies.values(),
                customer_count=market_state_model.demand
                if (
                    market_state_model.demand is not None
                    and market_state_model.demand
                    > config.MarketPreset.STARTING_CUSTOMER_COUNT
                )
                else config.MarketPreset.STARTING_CUSTOMER_COUNT,
            )
        except models.MarketState.DoesNotExist:
            self.market = Market(
                companies=self.companies.values(),
                customer_count=config.MarketPreset.STARTING_CUSTOMER_COUNT,
            )  # TODO: companies is aleady a dict, we dont have to generate it in market object
        print("Simulation was set up without any errors!")

    def create_company(self, company_model: models.Company) -> Company:
        # filter CompaniesUpgrades
        try:
            company_upgrades = models.CompaniesUpgrades.objects.filter(
                game=self.game_model,
                company=company_model,
            )
        except models.CompaniesUpgrades.DoesNotExist:
            company_upgrades = []
            print(f"CompaniesUpgrades WAS NONE FOR COMPANY {company_model.name}")

        # get CompaniesState model
        try:
            company_state = models.CompaniesState.objects.get(
                company=company_model, turn=self.turn_model
            )
        except models.CompaniesState.DoesNotExist:
            company_state = None
            print(f"CompaniesState WAS NONE FOR COMPANY {company_model.name}")

        # get CompaniesState model for the previous turn
        try:
            pt_company_state = models.CompaniesState.objects.get(
                company=company_model, turn=self.prev_turn_model
            )
        except models.CompaniesState.DoesNotExist:
            pt_company_state = None
            print(f"CompaniesState FOR PREV TURN WAS NONE FOR COMPANY {company_model.name}")

        init_brand = company_model.name
        if company_state is not None:
            init_max_budget = CompanyPreset.DEFAULT_BUDGET_PER_TURN if company_state.cash > CompanyPreset.DEFAULT_BUDGET_PER_TURN else (company_state.cash if company_state.cash > 0 else 0)
            init_inventory = company_state.inventory if company_state.inventory is not None else 0
            init_balance = company_state.cash if company_state.cash is not None else CompanyPreset.DEFAULT_BUDGET_PER_TURN #CHANGED after balance became cash (in models)
            init_ret_earnings = company_state.ret_earnings if company_state.ret_earnings is not None else 0
            init_loans = company_state.loans if company_state.loans is not None else 0
            init_amount_spent_on_upgrades = company_state.r_d if company_state.r_d is not None else 0
            if company_state.factory is not None:
                init_capital_investment_this_turn = company_state.factory.capital if company_state.factory.capital is not None else 0
            else:
                init_capital_investment_this_turn = 0
        else:
            init_max_budget = CompanyPreset.DEFAULT_BUDGET_PER_TURN
            init_inventory = 0
            init_balance = CompanyPreset.DEFAULT_BUDGET_PER_TURN
            init_ret_earnings = 0
            init_loans = 0
            init_amount_spent_on_upgrades = 0
            init_capital_investment_this_turn = 0

        init_loan_limit = self.teacher_decisions.get("loan_limit", CompanyPreset.DEFAULT_LOAN_LIMIT)
        init_interest_rate = self.teacher_decisions.get("interest_rate", CompanyPreset.DEFAULT_INTEREST_RATE)
        init_tax_rate = self.teacher_decisions.get("tax_rate", CompanyPreset.DEFAULT_TAX_RATE)

        if pt_company_state is not None:
            init_prev_turn_inventory = pt_company_state.inventory if pt_company_state.inventory is not None else 0
            if pt_company_state.production is not None:
                init_prev_turn_prod_ppu = pt_company_state.production.man_cost if pt_company_state.production.man_cost is not None else 0
                init_prev_turn_total_ppu = pt_company_state.production.man_cost_all if pt_company_state.production.man_cost_all is not None else 0
            else:
                init_prev_turn_prod_ppu = 0
                init_prev_turn_total_ppu = 0
        else:
            init_prev_turn_prod_ppu = 0
            init_prev_turn_total_ppu = 0
            init_prev_turn_inventory = 0

        

        init_marketing: Dict[str, MarketingType] = {}
        marketing_model = company_state.marketing
        if marketing_model is not None:
            if marketing_model.billboard is not None and marketing_model.billboard > 0:
                init_marketing["billboard"] = Billboard(marketing_model.billboard)
            if marketing_model.ooh is not None and marketing_model.ooh > 0:
                init_marketing["ooh"] = OOH(marketing_model.ooh)
            if marketing_model.podcast is not None and marketing_model.podcast > 0:
                init_marketing["podcast"] = Podcast(marketing_model.podcast)
            if marketing_model.viral is not None and marketing_model.viral > 0:
                init_marketing["social media"] = SocialMedia(marketing_model.viral)
            if marketing_model.tv is not None and marketing_model.tv > 0:
                init_marketing["cable news"] = CableNews(marketing_model.tv)

        # instantiate the new company with the prepared values
        new_company = Company(
            brand = init_brand,
            inventory = init_inventory,
            balance = init_balance,
            ret_earnings = init_ret_earnings,
            loans = init_loans,
            amount_spent_on_upgrades = init_amount_spent_on_upgrades,

            loan_limit = init_loan_limit,
            interest_rate = init_interest_rate,
            tax_rate = init_tax_rate,

            max_budget = init_max_budget,
            prev_turn_prod_ppu = init_prev_turn_prod_ppu,
            prev_turn_total_ppu = init_prev_turn_total_ppu,
            prev_turn_inventory = init_prev_turn_inventory,
            
            capital_investment_this_turn = init_capital_investment_this_turn,
            marketing = init_marketing,
        )

        new_company.factory = self.create_factory(factory_model=company_state.factory)
        new_company.product = self.create_product(
            company=new_company,
            production_model=company_state.production,
            company_upgrades=company_upgrades,
        )
        return new_company


    def create_factory(self, factory_model: models.Factory) -> Factory:
        if factory_model is not None:
            new_factory = Factory(
                capacity= factory_model.capacity
                if factory_model.capacity is not None
                else FactoryPreset.STARTING_CAPACITY,

                capital_investment=factory_model.capital_investments
                if factory_model.capital_investments is not None
                else FactoryPreset.STARTING_INVESTMENT,

                inflation=self.teacher_decisions.get("inflation", FactoryPreset.BASE_INFLATION),
            )
        else:
            new_factory = Factory(
                capacity= FactoryPreset.STARTING_CAPACITY,
                capital_investment= FactoryPreset.STARTING_INVESTMENT,
                inflation=self.teacher_decisions.get("inflation", FactoryPreset.BASE_INFLATION),
            )

        new_factory.base_energy_cost = (
            factory_model.base_cost
            if factory_model.base_cost is not None
            else FactoryPreset.BASE_ENERGY_COST
        )
        return new_factory

    def create_product(
        self,
        company: Company,
        production_model: models.Production,
        company_upgrades: list[models.CompaniesUpgrades],
    ) -> Product:
        # create Product object
        new_product = (
            LastingProduct()
        )  # TODO: add option to create the other kind of product (?)
        if production_model is not None:
            new_product.set_price(
                production_model.sell_price
                if production_model.sell_price is not None
                else 0
            )  # TODO change default sell price
            new_product.set_man_cost(
                production_model.man_cost
                if production_model.man_cost is not None
                else FactoryPreset.BASE_MATERIAL_COST_PER_UNIT
            )
            company.production_volume = (
                production_model.volume if production_model.volume is not None else 0
            )
        else:
            new_product.set_price(0)
            new_product.set_man_cost(FactoryPreset.BASE_MATERIAL_COST_PER_UNIT)
            company.production_volume = 0
            print(f"PRODUCTION MODEL WAS NONE FOR COMPANNY {company.brand}")

        new_product.upgrades = (
            {}
        )  # TODO: maybe this should be in the object constructor
        for company_upgrade_model in company_upgrades:
            upgrade_model = company_upgrade_model.upgrade
            if ((company_upgrade_model.status == "f" or company_upgrade_model.status == "finished") and company_upgrade_model.turn is not None and company_upgrade_model.turn.number < self.turn_model.number):
                new_product.add_upgrade(
                    name=upgrade_model.name,  # string
                    status=company_upgrade_model.status,  # string "s", "ns", "f" for "started", "not started", and "finished"
                    progress=company_upgrade_model.progress,  # pos integer
                    total_cost=upgrade_model.cost,  # pos integer
                    sales_effect=upgrade_model.sales_effect,  # float
                    man_cost_effect=upgrade_model.man_cost_effect,  # float
                )
            else:
                pass
        new_product.setup_product()
        return new_product

    def run_simulation(self) -> None:
        for company in self.companies.values():
            company.produce_products()
            company.invest_into_factory()

        self.market.generate_distribution()
        #for company in self.companies.values():
        #    print(company)
        #    pass
        pass

    def write_simulation_results(self) -> None:
        # declare lists and dictionaries
        companies_models: models.Company = []
        ct_companies_states: Dict[
            models.Company, models.CompaniesState
        ] = {}  # current turn companies state
        nt_companies_states: Dict[
            models.Company, models.CompaniesState
        ] = {}  # next turn companies state

        # load the company models
        companies_models = models.Company.objects.filter(game=self.game_model)
        # load the company states
        for company_model in companies_models:
            try:  # get company states for the current trun
                ct_company_state_model = models.CompaniesState.objects.get(
                    company=company_model, turn=self.turn_model
                )
                ct_companies_states[company_model] = ct_company_state_model
            except models.CompaniesState.DoesNotExist:
                pass
            try:  # get company states for the next turn
                nt_company_state_model = models.CompaniesState.objects.get(
                    company=company_model, turn=self.next_turn_model
                )
                nt_companies_states[company_model] = nt_company_state_model
            except models.CompaniesState.DoesNotExist:
                pass

        # load the market state model
        ct_market_state_model = models.MarketState.objects.get(turn=self.turn_model)
        nt_market_state_model = models.MarketState.objects.get(turn=self.next_turn_model)

        # write data from classes to models
        # curent turn
        ct_total_units_sold = 0
        ct_total_units_demanded = 0
        ct_total_units_manufactured = 0
        ct_total_inventory = 0
        ct_total_capacity = 0
        for company_model in ct_companies_states.keys():
            company_class_object = self.companies[company_model.name]
            ct_total_units_manufactured += (
                company_class_object.production_volume
            )  # add units produced to overall sum of all units produced
            ct_total_inventory += (
                company_class_object.inventory
            )  # add inventory to overall sum of all inventories
            ct_total_units_sold += (
                company_class_object.units_sold
            )  # add units sold to overall sum of all units sold
            ct_total_units_demanded += (
                self.market.customer_distribution[company_class_object.brand]["demand"]
            )  # add units demanded to overall sum of all units demanded
            ct_total_capacity += (
                company_class_object.factory.capacity
            )  # add factory capacity to overall sum of all capacities
            self.write_current_turn_company_state(company_class_object=self.companies[company_model.name], ct_company_state_model=ct_companies_states[company_model])

        # write current turn market state
        ct_market_state_model.sold = ct_total_units_sold  # sum of all units sold
        ct_market_state_model.demand = ct_total_units_demanded  # sum of all units demanded
        ct_market_state_model.capacity = ct_total_capacity  # sum of all capacities
        ct_market_state_model.inventory = ct_total_inventory  # sum of all inventories
        ct_market_state_model.manufactured = ct_total_units_manufactured  # sum of all units manufactured
        ct_market_state_model.save()

        # write data from classes to models
        # next turn
        for company_model in nt_companies_states.keys():
            self.write_next_turn_company_state(
                company_class_object=self.companies[company_model.name],
                nt_company_state_model = nt_companies_states[company_model],
            )
        nt_market_state_model.demand = ct_total_units_demanded
        nt_market_state_model.save()

    def write_current_turn_company_state(self, company_class_object: Company, ct_company_state_model: models.CompaniesState) -> None:
        
        ct_company_state_model.cash = company_class_object.balance #round(company_class_object.balance, 2)  #CHANGED after balance became cash (in models)
        ct_company_state_model.stock_price = company_class_object.stock_price #round(company_class_object.stock_price, 2)
        ct_company_state_model.inventory = company_class_object.inventory
        
        ct_company_state_model.orders_received = self.market.customer_distribution[company_class_object.brand]["demand"]
        ct_company_state_model.orders_fulfilled = company_class_object.units_sold
        #ct_company_state_model.cash = company_class_object.prev_balance #round(company_class_object.prev_balance, 2)
        ct_company_state_model.ret_earnings = company_class_object.ret_earnings + company_class_object.profit_after_tax #round((company_class_object.ret_earnings+ company_class_object.profit_after_tax),2)
        ct_company_state_model.net_profit = company_class_object.profit_after_tax #round(company_class_object.profit_after_tax, 2)
        ct_company_state_model.depreciation = company_class_object.factory.upkeep.get("writeoff", 0) #(round(company_class_object.factory.upkeep.get("writeoff", 0), 2)
        ct_company_state_model.new_loans = company_class_object.new_loans #round(company_class_object.new_loans, 2)
        ct_company_state_model.inventory_charge = company_class_object.value_paid_in_inventory_charge #round(company_class_object.value_paid_in_inventory_charge, 2)
        ct_company_state_model.sales = company_class_object.income_per_turn #round(company_class_object.income_per_turn, 2)
        ct_company_state_model.manufactured_man_cost = company_class_object.prod_costs_per_turn #round(company_class_object.prod_costs_per_turn, 2)
        ct_company_state_model.sold_man_cost = company_class_object.cost_of_goods_sold
        
        ct_company_state_model.tax = company_class_object.value_paid_in_tax #round(company_class_object.value_paid_in_tax, 2)
        ct_company_state_model.profit_before_tax = company_class_object.profit_before_tax #round(company_class_object.profit_before_tax, 2)
        ct_company_state_model.interest = company_class_object.value_paid_in_interest #round(company_class_object.value_paid_in_interest, 2)
        ct_company_state_model.cash_flow_res = company_class_object.cashflow_result #round(company_class_object.cashflow_result, 2)
        ct_company_state_model.loan_repayment = company_class_object.value_paid_in_loan_repayment #round(company_class_object.value_paid_in_loan_repayment, 2)
        ct_company_state_model.loans = company_class_object.loans #round(company_class_object.loans, 2)
        ct_company_state_model.inventory_upgrade = company_class_object.value_paid_in_stored_product_upgrades #round(company_class_object.value_paid_in_stored_product_upgrades, 2)
        ct_company_state_model.overcharge_upgrade = company_class_object.price_diff_stored_products #round(company_class_object.price_diff_stored_products, 2)

        if ct_company_state_model.production is not None:
            ct_company_state_model.production.man_cost = company_class_object.prod_ppu #round(company_class_object.prod_ppu, 2)
            ct_company_state_model.production.man_cost_all = company_class_object.total_ppu #round(company_class_object.total_ppu, 2)
            ct_company_state_model.production.volume = company_class_object.production_volume
            ct_company_state_model.production.save()
        if ct_company_state_model.factory is not None:
            ct_company_state_model.factory.capacity = company_class_object.factory.capacity 
            ct_company_state_model.factory.capital_investments = company_class_object.factory.capital_investment
            ct_company_state_model.factory.save()
        ct_company_state_model.save()
    
    def write_next_turn_company_state(self, company_class_object: Company, nt_company_state_model: models.CompaniesState) -> None:
        nt_company_state_model.cash = company_class_object.balance #CHANGED after balance became cash (in models)
        nt_company_state_model.inventory = company_class_object.inventory
        nt_company_state_model.loans = company_class_object.loans
        nt_company_state_model.ret_earnings = (
            company_class_object.ret_earnings
            + company_class_object.profit_after_tax
        )
        if nt_company_state_model.production is not None:
            nt_company_state_model.production.man_cost = FactoryPreset.BASE_MATERIAL_COST_PER_UNIT
            nt_company_state_model.production.save()
        if nt_company_state_model.factory is not None:
            nt_company_state_model.factory.capacity = company_class_object.factory.capacity
            nt_company_state_model.factory.capital_investments = (
                company_class_object.factory.capital_investment
            )
            nt_company_state_model.factory.save()
        nt_company_state_model.save()

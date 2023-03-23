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
from saip_simulation.marketing import Billboard, SocialMedia, CableNews, Podcast, OOH
from saip_simulation.product import Product, LastingProduct, Upgrade

from saip_simulation.config import FactoryPreset
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
        new_turn_model: models.Turn,
    ) -> None:

        self.companies = {}
        self.market = None
        self.game_model = game_model
        self.turn_model = turn_model
        self.new_turn_model = new_turn_model
        self.current_turn = turn_model.number
        self.turn_limit = game_model.turns
        self.setup_simulation()

    def setup_simulation(self) -> None:
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
                if market_state_model is not None
                else config.MarketPreset.STARTING_CUSTOMER_COUNT,
            )  # TODO: take care of the other attributes from the model
        except models.MarketState.DoesNotExist:
            self.market = Market(
                companies=self.companies.values()
            )  # TODO: companies is aleady a dict, we dont have to generate it in market object
        print("Simulation was set up without any errors!")

    def create_company(self, company_model: models.Company) -> Company:
        # create new instance of company class, with default values
        # change the default values based on models
        new_company = Company(brand=company_model.name)

        # filter models for companies_upgrades that belong to this game and this company
        try:
            company_upgrades = models.CompaniesUpgrades.objects.filter(
                game=self.game_model,
                company=company_model,
                turn=self.turn_model,  # TODO Test the addition of turn
            )
        except models.CompaniesUpgrades.DoesNotExist:
            company_upgrades = []
            # TODO: add error message maybe

        # get model for companies_state that belongs to this turn and this company
        # these are the decisisions made by the company in the given turn
        # and all the relevant models are associated with this class (except for upgrades)
        try:
            company_state = models.CompaniesState.objects.get(
                company=company_model, turn=self.turn_model
            )
        except models.CompaniesState.DoesNotExist:
            company_state = None
            # TODO: add error message maybe

        # parse the companies state model and create objects
        if company_state is not None:

            new_company.remaining_budget = (
                company_state.balance if company_state.balance is not None else 0
            )  # float
            new_company.stock_price = (
                company_state.stock_price
                if company_state.stock_price is not None
                else 0
            )  # float
            new_company.inventory = (
                company_state.inventory if company_state.inventory is not None else 0
            )  # pos int
            # r_d = company_state.r_d   #pos big int    #TODO: add rnd to class obejct

            # create objects from models
            # setup factory object
            factory_model = company_state.factory
            if factory_model is not None:
                new_company.factory = self.create_factory(factory_model=factory_model)
            else:
                print(f"FACTORY WAS NONE FOR COMPANY {company_model.name}")
                new_company.factory = None
            # setup marketing objects in dict
            marketing_model = company_state.marketing
            if marketing_model is not None:
                if (
                    marketing_model.billboard is not None
                    and marketing_model.billboard > 0
                ):
                    new_company.marketing["billboard"] = Billboard(
                        marketing_model.billboard
                    )
                if marketing_model.ooh is not None and marketing_model.ooh > 0:
                    new_company.marketing["ooh"] = OOH(marketing_model.ooh)
                if marketing_model.podcast is not None and marketing_model.podcast > 0:
                    new_company.marketing["podcast"] = Podcast(marketing_model.podcast)
                if marketing_model.viral is not None and marketing_model.viral > 0:
                    new_company.marketing["social media"] = SocialMedia(
                        marketing_model.viral
                    )
                if marketing_model.tv is not None and marketing_model.tv > 0:
                    new_company.marketing["cable news"] = CableNews(marketing_model.tv)
            else:
                pass
            # setup product
            new_company.product = self.create_product(
                company=new_company,
                production_model=company_state.production,
                company_upgrades=company_upgrades,
            )

        return new_company

    def create_factory(self, factory_model: models.Factory) -> Factory:
        new_factory = Factory()

        # all attributes are positive integer (from model)
        # TODO: types are not consistent: model <-> our class
        new_factory.capacity = factory_model.capacity if factory_model.capacity is not None else FactoryPreset.STARTING_CAPACITY
        new_factory.base_energy_cost = factory_model.base_cost if factory_model.base_cost is not None else FactoryPreset.BASE_ENERGY_COST
        new_factory.capital_investment = factory_model.capital_investments if factory_model.capital_investments is not None else FactoryPreset.STARTING_INVESTMENT
        new_factory.capital_investment_this_turn = factory_model.capital if factory_model.capital is not None else 0.0
    
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
            new_product.set_price(production_model.sell_price)
            new_product.set_man_cost(production_model.man_cost)
            company.production_volume = (
                production_model.volume if production_model.volume is not None else 0
            )
        else:
            company.production_volume = 0 # TODO: remove this - temp fix
            print(f"PRODUCTION MODEL WAS NONE FOR COMPANNY {company.brand}")

        new_product.upgrades = (
            {}
        )  # TODO: maybe this should be in the object constructor
        for company_upgrade_model in company_upgrades:
            upgrade_model = company_upgrade_model.upgrade
            new_product.add_upgrade(
                name=upgrade_model.name,  # string
                status=company_upgrade_model.status,  # string "s", "ns", "f" for "started", "not started", and "finished"
                progress=company_upgrade_model.progress,  # pos integer
                total_cost=upgrade_model.cost,  # pos integer
                sales_effect=upgrade_model.sales_effect,  # float
                man_cost_effect=upgrade_model.man_cost_effect,  # float
            )
            pass
        new_product.setup_product()
        return new_product

    def run_simulation(self) -> None:
        for company in self.companies.values():
            print(company)
            company.factory.invest_into_factory(
                company.factory.capital_investment_this_turn
            )  # TODO: check if correct
            company.factory.calculate_price_per_unit(company.production_volume)
            company.produce_products()

        self.market.generate_distribution()
        for company in self.companies.values():
            company.yield_agg_marketing_value()
            company.calculate_stock_price()
            print(company)
        pass

    def write_simulation_results(self) -> None:
        # declare lists and dictionaries
        companies_models: models.Company = []
        ct_companies_states: Dict[models.Company, models.CompaniesState] = {}
        nt_companies_states: Dict[models.Company, models.CompaniesState] = {}

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
                    company=company_model, turn=self.new_turn_model
                )
                nt_companies_states[company_model] = nt_company_state_model
            except models.CompaniesState.DoesNotExist:
                pass
        # load the market state model
        ct_market_state = models.MarketState.objects.get(turn=self.turn_model)


        # write data from classes to models
        # curent turn
        ct_total_units_sold = 0
        ct_total_units_demanded = 0
        ct_total_units_manufactured = 0
        ct_total_inventory = 0
        ct_total_capacity = 0
        for company_model in ct_companies_states.keys():
            company_class_object = self.companies[company_model.name]
            # add units produced to overall sum of all units produced
            ct_total_units_manufactured += company_class_object.production_volume   #TODO: maybe this attribute will change later
            ct_companies_states[company_model].balance = company_class_object.remaining_budget
            ct_companies_states[company_model].stock_price = company_class_object.stock_price
            ct_companies_states[company_model].inventory = company_class_object.inventory
            # add inventory to overall sum of all inventories
            ct_total_inventory += company_class_object.inventory
            ct_companies_states[company_model].orders_received = self.market.customer_distribution[company_class_object.brand]["demand"]
            # add units demanded to overall sum of all units demanded
            ct_total_units_demanded += self.market.customer_distribution[company_class_object.brand]["demand"]
            ct_companies_states[company_model].orders_fulfilled = company_class_object.units_sold
            # add units sold to overall sum of all units sold
            ct_total_units_sold += company_class_object.units_sold
            ct_companies_states[company_model].cash = company_class_object.remaining_budget # TODO: add correct value (same as budget - one of them probably should be a different value)
            ct_companies_states[company_model].ret_earnings = 0  # TODO: add correct value  #doteraz sales scitane dokopy (? mozno)
            ct_companies_states[company_model].net_profit = company_class_object.profit # TODO: check if correct (income per turn - costs per turn)
            ct_companies_states[company_model].depreciation = (
                company_class_object.factory.upkeep["writeoff"]
                if company_class_object.factory.upkeep["writeoff"]
                else 0
            )
            ct_companies_states[company_model].new_loans = 0  # TODO: add correct value
            ct_companies_states[company_model].inventory_charge = company_class_object.inventory * FactoryPreset.INVENTORY_CHARGE_PER_UNIT
            ct_companies_states[company_model].sales =  company_class_object.income_per_turn #TODO: check if correct
            ct_companies_states[company_model].manufactured_man_cost = company_class_object.production_volume * company_class_object.product.get_man_cost() # TODO: add units manufactured attrubute  
                #TODO possibly add other upkeep costs to the overall manufacturing cost
                # change to price per one unit and add ((the other costs + man cost) / units produced ) 
                # change this to produced units instead of sold units
                # MAN_COST_ALL - cena za jeden kus ale so vsetkymi nakladmi
                # TODO: Actually... we should have both sold man cost and prod man cost.

                # TODO: add inflation - it should only affect the man cost 
            ct_companies_states[company_model].tax = 0  # TODO: add correct value   #TODO: add taxation #TODO: value in cash
            ct_companies_states[company_model].profit_before_tax = 0  # TODO: add correct value #TODO: taxation
            ct_companies_states[company_model].interest = company_class_object.interest_rate #TODO: change to the value in cash that is deducted after interest
            ct_companies_states[company_model].cash_flow_res = 0  # TODO: add correct value  #TODO: taxation    #cash z minuleho kola plus trzby, odratava sa kolko minuli na vyrobu produktov celkovo, odrata sa expenses (investicie do marketingu a rnd, capital), odrata sa interest (iba urok), odrata sa dan (asi z predaja)
            # z cashflow res mame urcovat ci berieme novu pozicku a kolko cashu mame
            ct_companies_states[company_model].loan_repayment = 0  # TODO: add correct value
            ct_companies_states[company_model].loans = company_class_object.loans

            if ct_companies_states[company_model].production is not None:

                ct_companies_states[company_model].production.man_cost = (
                    company_class_object.product.get_man_cost()
                )  # TODO maybe we dont want to write this in this turn

                ct_companies_states[company_model].production.volume = company_class_object.production_volume
                # this is done because the volume of actual products produced could have differed from the one submitted by the company (for instance, because of a lack of funds)

                ct_companies_states[company_model].production.save()
            if ct_companies_states[company_model].factory is not None:
                ct_companies_states[company_model].factory.capacity = company_class_object.factory.capacity
                # add factory capacity to overall sum of all capacities
                ct_total_capacity += company_class_object.factory.capacity
                ct_companies_states[company_model].factory.save()
            ct_companies_states[company_model].save()

        #write current turn market state
        ct_market_state.sold = ct_total_units_sold          # sum of all units sold
        ct_market_state.demand = ct_total_units_demanded    # sum of all units demanded
        ct_market_state.capacity = ct_total_capacity        # sum of all capacities
        ct_market_state.inventory = ct_total_inventory      # sum of all inventories
        ct_market_state.manufactured = ct_total_units_manufactured  # sum of all units manufactured
        ct_market_state.save()
        
        # write data from classes to models
        # next turn
        for company_model in nt_companies_states.keys():
            company_class_object = self.companies[company_model.name]
            nt_companies_states[company_model].balance = company_class_object.remaining_budget
            # nt_companies_states[
            #    company_model
            # ].stock_price = company_class_object.stock_price
            nt_companies_states[company_model].inventory = company_class_object.inventory

            if nt_companies_states[company_model].production is not None:
                nt_companies_states[company_model].production.man_cost = company_class_object.product.get_man_cost()
                nt_companies_states[company_model].production.save()
            if nt_companies_states[company_model].factory is not None:
                nt_companies_states[company_model].factory.capacity = company_class_object.factory.capacity
                ct_companies_states[company_model].factory.capital_investments = company_class_object.factory.capital_investment #TODO maybe add this to current turn as well
                nt_companies_states[company_model].factory.save()
            nt_companies_states[company_model].save()

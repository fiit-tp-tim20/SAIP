from typing import Dict

from .company import Company
from .market import Market
from .company import Factory
from .marketing import Billboard, SocialMedia, CableNews, Podcast, OOH
from .product import Product

import saip_api.models as models


class Simulation:
    companies: Dict[str, Company]
    market: Market      
    current_turn: int   #the current turn being evaluated
    turn_limit: int     #maximum number of turns     

    def __init__(self, game_model : models.Game, turn_model : models.Turn) -> None:

        self.companies = {}     #TODO: check if this is the correct way of initializing the attribute
        self.market = None
        self.current_turn = turn_model.number
        self.turn_limit = game_model.turns
        self.setup_simulation(game_model=game_model, turn_model=turn_model)

    
    def setup_simulation(self, game_model : models.Game, turn_model : models.Turn):
        #Filter companies that are in this game
        companies_models = models.Company.objects.filter(game=game_model)
        #iterate over the companies and create all relevant classes
        for company_model in companies_models:
            #add the company to the companies dictionary
            self.companies[company_model.name] = self.create_company(game_model=game_model, turn_model=turn_model, company_model=company_model)

        #setup the market attributes
        market_state_model = models.MarketState.objects.get(turn=turn_model)
        self.market = self.create_market(market_state_model=market_state_model)

        print(self.companies)

        

    def create_company(self, game_model : models.Game, turn_model : models.Turn, company_model : models.Company) -> Company:
        #create new instance of company class, with default values
        #change the default values based on models
        new_company = Company()

        #filter models for companies_upgrades that belong to this game and this company
        try:
            company_upgrades = models.CompaniesUpgrades.objects.filter(game=game_model, company=company_model)
        except models.CompaniesUpgrades.DoesNotExist:
            company_upgrades = []
            #TODO: add error message maybe

        #get model for companies_state that belongs to this turn and this company
        #these are the decisisions made by the company in the given turn
        #and all the relevant models are associated with this class (except for upgrades)
        try:
            company_state = models.CompaniesState.objects.get(company=company_model, turn=turn_model)
        except models.CompaniesState.DoesNotExist:
            company_state = None
            #TODO: add error message maybe

        #parse the companies state model and create objects
        if company_state != None:

            new_company.remaining_budget = company_state.balance    #float
            new_company.stock_price = company_state.stock_price     #float
            new_company.storage_count = company_state.inventory     #pos int
            r_d = company_state.r_d                                 #pos big int    #TODO: add rnd to class obejct

            #create objects from models
            #setup factory object
            factory_model = company_state.factory
            new_company.factory = self.create_factory(factory_model=factory_model)
            #setup marketing objects in dict
            marketing_model = company_state.marketing
            if marketing_model.billboard > 0:
                new_company["billboard"] = Billboard(marketing_model.billboard)
            if marketing_model.ooh > 0:
                new_company["ooh"] = OOH(marketing_model.ooh)
            if marketing_model.podcast > 0:
                new_company["podcast"] = Podcast(marketing_model.podcast)
            if marketing_model.viral > 0:
                new_company["social media"] = SocialMedia(marketing_model.viral)
            if marketing_model.tv > 0:
                new_company["cable news"] = CableNews(marketing_model.tv)
            #setup product
            new_company.product = self.create_product(production_model=company_state.production, company_upgrades=company_upgrades)
        
        return new_company
    
    def create_factory(self, factory_model : models.Factory) -> Factory:
        new_factory = Factory()

        #all attributes are positive integer (from model)
        #TODO: types are not consistent: model <-> our class
        prod_emp = factory_model.prod_emp
        cont_emp = factory_model.cont_emp 
        aux_emp = factory_model.aux_emp

        new_factory.capacity = factory_model.capacity
        new_factory.base_energy_cost = factory_model.base_cost
        new_factory.total_investment = factory_model.capital
        
        #TODO: add all attributes we need for initialization
        return new_factory

    def create_product(self, production_model : models.Production, company_upgrades: list[models.CompaniesUpgrades]) -> Product:
        #create Product object
        new_product = Product()
        new_product.set_price(production_model.sell_price)
        volume = production_model.volume #TODO add volume to product class (or maybe the company, but product makes sense)

        #TODO: solve the fact that we have multiple upgrades and only one _upgrade_price in product class
        for company_upgrade_model in company_upgrades:
            upgrade_model = company_upgrade_model.upgrade
            name = upgrade_model.name #char field
            new_product.upgrades[name] = {
                "cost": upgrade_model.cost, #pos int
                "effect": upgrade_model.effect,  #float
                "status": company_upgrade_model.status, #char field ("s", "ns", "f") for ("started", "not started", "finished")
                "progress": company_upgrade_model.progress #pos int
            }
            pass

        return new_product
    
    def create_market(self, market_state_model: models.MarketState) -> Market:
        new_market = Market()
        
        #TODO finish market
        size = market_state_model.size #models.PositiveIntegerField(null=True)
        demand = market_state_model.demand #models.PositiveIntegerField(null=True)
        return new_market


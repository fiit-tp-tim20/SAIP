from typing import Dict

from .company import Company
from .market import Market
from .company import Factory

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

        print(self.companies)
        

    def create_company(self, game_model : models.Game, turn_model : models.Turn, company_model : models.Company) -> Company:

        #filter models for companies_upgrades that belong to this game and this company
        try:
            company_upgrades = models.CompaniesUpgrades.objects.filter(game=game_model, company=company_model)
        except models.CompaniesUpgrades.DoesNotExist:
            company_upgrades = []
            #TODO: add error message maybe
        #parse the upgrades models and create objects
        for company_upgrade in company_upgrades:
            #TODO: add upgrades to product class
            pass

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
            production_model = company_state.production
            factory_model = company_state.factory
            marketing_model = company_state.marketing
            remaining_budget = company_state.balance    #float      #TODO: check if remaining_budget = balance
            stock_price = company_state.stock_price     #float
            storage_count = company_state.inventory     #pos int    #TODO: check if storage_count = inventory
            r_d = company_state.r_d                     #pos big int
            #create objects from models
            factory = self.create_factory(factory_model=factory_model)
            
            pass
        new_company = Company()

        return new_company
    
    def create_factory(self, factory_model : models.Factory) -> Factory:
        #all attributes are positive integer
        #TODO: types are not consistent: model <-> our class
        prod_emp = factory_model.prod_emp
        cont_emp = factory_model.cont_emp 
        aux_emp = factory_model.aux_emp
        capacity = factory_model.capacity
        base_cost = factory_model.base_cost
        capital = factory_model.capital

        #TODO pass the attributes into the object
        new_factory = Factory()
        return new_factory


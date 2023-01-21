from typing import Dict

from .company import Company
from .market import Market

import saip_api.models as models


class Simulation:
    companies: Dict[str, Company]
    market: Market      
    current_turn: int   #the current turn being evaluated
    turn_limit: int     #maximum number of turns     

    def __init__(self, game, turn) -> None:
        self.companies = {}     #TODO: check if this is the correct way of initializing the attribute
        self.setup_simulation(game, turn)

    
    def setup_simulation(self, game, turn):
        #sets up the class attributes - companies, turns, etc
        companies_models = models.Company.objects.filter(game=game)

        #search all models referred to by each company and write them into classes
        for company_model in companies_models:
            product = None
            storage_count = -1
            debit = -1
            credit = -1
            profit = -1
            max_budget = -1
            remaining_budget = -1
            factory = None
            costs_per_turn = None
            stock_price = -1
            marketing = None

            try:
                company_upgrades = models.CompaniesUpgrades.objects.filter(game=game, company=company_model)
            except models.CompaniesUpgrades.DoesNotExist:
                company_upgrades = []
                #TODO: add error message maybe
            try:
                company_state = models.CompaniesState.objects.get(company=company_model, turn=turn)
            except models.CompaniesState.DoesNotExist:
                company_state = None
                #TODO: add error message maybe
        
            for company_upgrade in company_upgrades:
                #TODO: add upgrades to product class
                pass
            if company_state != None:
                #TODO: add company state attributes to Company class
                production = company_state.production   #model object
                spending = company_state.spending       #model object
                factory = company_state.factory         #model object   #TODO: change to Factory class object!!!
                fan_base = company_state.fan_base       #integer
                remaining_budget = company_state.balance#float      #TODO: check if this is the correct attribute
                stock_price = company_state.stock_price #float
                storage_count = company_state.inventory #integer    #TODO: check if this is the correct attribute
                pass
            
            new_company = Company(product = product,
                storage_count = storage_count,
                debit = debit,
                credit = credit,
                profit = profit,
                max_budget = max_budget,
                remaining_budget = remaining_budget,
                factory = factory,
                costs_per_turn = costs_per_turn,
                stock_price = stock_price,
                marketing = marketing
            )
            #add the company to the companies dictionary
            self.companies[company_model.name] = new_company
            print(self.companies[company_model.name])
            

        pass
    
    def end_turn(self):
        #ends the turn - and runs the simulation
        pass
    
    def get_company_state(self, company):
        #returns information about the state of the market, and new state of the company
        #returns a json with company_state information
        pass
    
    def get_market_state(self):
        #returns information about the market state
        #returns json
        pass

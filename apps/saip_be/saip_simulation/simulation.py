from typing import Dict

from .company import Company
from .market import Market

import saip_api.models as models


class Simulation:
    companies: Dict[str, Company]
    market: Market      
    current_turn: int   #the current turn being evaluated
    turn_limit: int     #maximum number of turns     

    def __init__(self, game, game_id, turn) -> None:
        self.setup_simulation(game, game_id, turn)

    
    def setup_simulation(self, game, game_id, turn):
        #sets up the class attributes - companies, turns, etc
        companies_models = models.Company.objects.filter(game=game)

        #upgrades are particular to company_upgrades
        #upgrades_models = models.Upgrade.objects.filter(game=game)

        #search all models refered to by each company and write them into classes
        for company_model in companies_models:
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
        
            for upgrade in company_upgrades:
                #TODO: add upgrades to product class
                pass
            if company_state != None:
                #TODO: add company state attributes to Company class
                pass
            

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

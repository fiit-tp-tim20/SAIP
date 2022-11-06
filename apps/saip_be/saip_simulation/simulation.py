from typing import Dict

from company import Company
from market import Market


class Simulation:
    companies: Dict[str, Company]
    market: Market
    
    #ends the turn - and runs the simulation
    def end_turn(self):
        pass

    #updates the database containing market info
    #called by class lecturer user
    def commit_market_state(self):
        pass

    #updates the database containing company decisions
    #from company user
    def commit_company_decisions(self):
        pass
    
    #returns information about the state of the market, and new state of the company
    #returns a json with company_state information
    def get_company_state(self, user):
        pass
    
    #returns information about the market state
    #returns json
    def get_market_state(self):
        pass
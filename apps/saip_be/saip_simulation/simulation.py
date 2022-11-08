from typing import Dict

from company import Company
from market import Market


class Simulation:
    companies: Dict[str, Company]
    market: Market      
    current_turn: int   #the current turn being evaluated
    turn_limit: int     #maximum number of turns     

    def __init__(self) -> None:
        self.setup_simulation()
    
    def setup_simulation(self):
        #sets up the class attributes - companies, turns, etc
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
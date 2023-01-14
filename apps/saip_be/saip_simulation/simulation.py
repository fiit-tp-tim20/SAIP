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

from typing import Dict

from company import Company
from market import Market


class Simulation:
    companies: Dict[str, Company]
    market: Market
    
    def end_turn(self):
        pass
import sys
from pathlib import Path

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]
sys.path.append(str(root))
    
# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError: # Already removed
    pass

from dataclasses import dataclass
from typing import List

from saip_simulation.product import Product, DailyProduct, LastingProduct
from saip_simulation.marketing import *
from saip_simulation.config import TURN_LENGTH, FACTORY_MAINTENANCE_RATE, FactoryPreset
from saip_simulation.marketing import MarketingType
from typing import Dict
from math import ceil


@dataclass
class Factory:
    total_investment: float
    capacity: int
    
    employees: int  # to be changed to list (or multiple attributes) after we implement different employees
    employee_salary: float
    
    base_energy_cost: float
    energy_cost_per_machine: float
    machine_count: int
    
    upkeep = {
        'rent': float,
        'energy': float,
        'salaries': float,  # employees * salary * 3 (length of turn)
        'materials': float,  # this one might be irrelevant
        'maintenance': float
    }
    
    def __init__(self):
        self.__setup_factory()
    
    def __setup_factory(self):
        self.upkeep['rent'] = FactoryPreset.BASE_RENT
        self.base_energy_cost = FactoryPreset.BASE_ENERGY_COST
        
        self.total_investment = FactoryPreset.STARTING_INVESTMENT
        self.capacity = FactoryPreset.STARTING_CAPACITY
        
        self.employees = FactoryPreset.STARTING_EMPLOYEES
        self.employee_salary = FactoryPreset.BASE_SALARY
        
        self.energy_cost_per_machine = FactoryPreset.ENERGY_COST_PER_MACHINE
        self.machine_count = FactoryPreset.STARTING_MACHINES
    
    def update_upkeep(self, new_rent: float = None):
        if new_rent:
            self.upkeep['rent'] = new_rent
        self.upkeep['energy'] = self.__calculate_energies()
        self.upkeep['salaries'] = self.__calculate_salaries()
        self.upkeep['materials'] = 0
        self.upkeep['maintenance'] = self.total_investment * FACTORY_MAINTENANCE_RATE
    
    def __calculate_energies(self):
        return self.base_energy_cost + self.energy_cost_per_machine * self.machine_count
    
    def __calculate_salaries(self):
        return self.employee_salary * self.employees * TURN_LENGTH
    
    def total_upkeep(self) -> float:
        return self.upkeep.get('rent') + self.__calculate_energies() + self.__calculate_salaries()
    
    def calculate_price_per_unit(self, production_this_turn) -> float:
        ppu = self.total_upkeep() / production_this_turn
        
        if production_this_turn / self.capacity > FactoryPreset.OPTIMAL_THRESHOLD:
            return self.__price_per_unit_over_optimal(production_this_turn, ppu)
        
        return ppu
    
    def _price_per_unit(self, production_this_turn) -> float:  # used in unit tests only
        return self.total_upkeep() / production_this_turn

    def __price_per_unit_over_optimal(self, production_this_turn, ppu) -> float:
        over_threshold = ceil(
            (production_this_turn / self.capacity - FactoryPreset.OPTIMAL_THRESHOLD) * 100
        )
        return ppu * FactoryPreset.OVER_THRESHOLD_MULTIPLIER**over_threshold
        

@dataclass
class Company:
    product: Product
    storage_count: int  # assuming that the stored products are upgraded automatically, for a price
    debit: float
    credit: float  # debit and credit are mutually exclusive, one should be always zero
    profit: float  # per turn, add to either credit or debit
    max_budget: float
    remaining_budget: float
    factory: Factory
    costs_per_turn: dict
    stock_price: float  # company score
    marketing: Dict[str, MarketingType]
    
    def upgrade_stored_products(self):
        pass
    
    def calculate_stock_price(self):  # TODO STOCK PRICE!!!
        pass

    def get_product(self):
        return self.product
    
    def load_marketing_dict(self) -> None:
        # TODO some logic here
        self.marketing = {}
        
    def yield_agg_marketing_value(self) -> float:
        return self._agg_market_values()
    
    def _agg_market_values(self) -> float:
        # TODO some logic
        pass


if __name__ == '__main__':
    fac = Factory()

    unitsA = int(FactoryPreset.STARTING_CAPACITY * 0.81)
    unitsB = int(FactoryPreset.STARTING_CAPACITY * 0.9)
    unitsC = int(FactoryPreset.STARTING_CAPACITY * 0.99)

    ppuA = fac.calculate_price_per_unit(unitsA)
    ppuB = fac.calculate_price_per_unit(unitsB)
    ppuC = fac.calculate_price_per_unit(unitsC)
    print(f"A:{ppuA} \nB:{ppuB} \nC:{ppuC}")

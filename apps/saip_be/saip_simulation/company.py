from dataclasses import dataclass
from typing import List

from .product import Product, DailyProduct, LastingProduct
from .marketing import *
from .config import TURN_LENGTH, FACTORY_MAINTENANCE_RATE
from .marketing import MarketingType
from typing import Dict


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
        self.total_investment = 0
        self.capacity = 0
        self.employees = 0
        self.employee_salary = 0
        self.base_energy_cost = 0
        self.energy_cost_per_machine = 0
        self.machine_count = 0 
        self.upkeep = {
            'rent': 0,
            'energy': 0,
            'salaries': 0,
            'materials': 0,
            'maintenance': 0
        }
    
    def setup_factory(self):
        pass
    
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

    def __init__(self):
        #setup default values
        self.product = None
        self.storage_count = 0
        self.debit = 0
        self.credit = 0
        self.profit = 0
        self.max_budget = 0
        self.remaining_budget = 0
        self.factory = None
        self.costs_per_turn = {}
        self.stock_price = 0
        self.marketing = {}
        pass
    
    def upgrade_stored_products(self):
        pass
    
    def calculate_stock_price(self):
        pass

    def get_product(self):
        return self.product

    
    def load_marketing_dict(self) -> None:
        # ToDo some logic here
        self.marketing = {}
        
    def yield_agg_marketing_value(self) -> float:
        return self._agg_market_values()
    
    def _agg_market_values(self) -> float:
        # ToDO some logic
        pass

# ToDo STOCK PRICE!!!

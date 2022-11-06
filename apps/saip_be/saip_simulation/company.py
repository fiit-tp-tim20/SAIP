from dataclasses import dataclass

from product import Product, DailyProduct, LastingProduct
from config import TURN_LENGTH



@dataclass
class Factory:
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
        'materials': float  # this one might be irrelevant
    }
    
    def setup_factory(self):
        pass
    
    def update_upkeep(self, new_rent: float = None):
        if new_rent:
            self.upkeep['rent'] = new_rent
        self.upkeep['energy'] = self.__calculate_energies()
        self.upkeep['salaries'] = self.__calculate_salaries()
        self.upkeep['materials'] = 0
    
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
    stock_price: float  # score of the company
    
    def upgrade_stored_products(self):
        pass
    
    def calculate_stock_price(self):
        pass

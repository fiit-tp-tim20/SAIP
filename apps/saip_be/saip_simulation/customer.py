from dataclasses import dataclass
from abc import ABC, abstractmethod
from typing import Dict


@dataclass
class Customer(ABC):
    
    def calc_average_product_price(self, product_dict: Dict[str, float]) -> float:
        total = 0
        count = 0
        for value in product_dict.values():
            total += value
            count += 1
        return total / count
        
    def calc_weight_for_all_products(self, product_dict):
        average_price = self.calc_average_product_price(product_dict)
        
       
    @abstractmethod
    def calc_weight_for_product(self, average_product_price):
        pass
    

@dataclass
class HighBudgetCustomer(Customer):
    
    def calc_weight_for_product(self, average_product_price):
        return None


@dataclass
class LowBudgetustomer(Customer):
    
    def calc_weight_for_product(self, average_product_price):
        return None


@dataclass
class AverageBudgetCustomer(Customer):
    
    def calc_weight_for_product(self, average_product_price):
        return None


@dataclass
class InovationsLover(Customer):
    
    def calc_weight_for_product(self, average_product_price):
        return None

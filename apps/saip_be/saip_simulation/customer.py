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
from abc import ABC, abstractmethod
from typing import Dict
from random import random
from saip_simulation.product import Product, DailyProduct, LastingProduct


@dataclass
class Customer(ABC):
    product_dict: Dict[str, Product]
    
    def calc_average_product_price(self) -> float:
        total = 0
        count = 0
        try:
            for product in self.product_dict.values():
                total += product.get_price()
                count += 1
            return total / count
        except TypeError as e:
            raise e
        except AttributeError as e:
            raise e
        
    def calc_weights_for_all_products(self) -> dict:
        average_price = self.calc_average_product_price()
        weights = {}
        weight_sum = 0
        for key, product in self.product_dict.items():
            weights[key] = self.calc_weight_for_product(product.get_price(), average_price)
            weight_sum += weights.get(key)
        return self.normalise_weights(weights, weight_sum)
    
    def normalise_weights(self, weights: dict, weight_sum) -> dict:
        normalised_weights = {}
        for product, weight in weights.items():
            normalised_weights[product] = weight/weight_sum
        return normalised_weights
    
    def choose_product(self):
        choice = random()
        prev = 0
        weights = self.calc_weights_for_all_products()
        # print(weights)
        for key, value in weights.items():
            if choice < (prev + value):
                return key
            prev += value
        
            
    @abstractmethod
    def calc_weight_for_product(self, product_price, average_product_price):
        pass
    

@dataclass
class HighBudgetCustomer(Customer):
    
    def calc_weight_for_product(self, product_price, average_product_price):
        if product_price == -1:
            return 5
        return (product_price / average_product_price)**2


@dataclass
class LowBudgetustomer(Customer):
    
    def calc_weight_for_product(self, product_price, average_product_price):
        if product_price == -1:
            return 5
        return (average_product_price / product_price)**2


@dataclass
class AverageBudgetCustomer(Customer):
    
    def calc_weight_for_product(self, product_price, average_product_price):
        if product_price == -1:
            return 5
        return product_price / average_product_price


@dataclass
class InovationsLover(Customer):
    
    def calc_weights_for_all_products(self):
        average_price = self.calc_average_product_price()
        weights = {}
        weight_sum = 0
        for key, product in self.product_dict.items():
            weights[key] = self.calc_weight_for_product(product, average_price)
            weight_sum += weights.get(key)
        return self.normalise_weights(weights, weight_sum)
    
    def calc_weight_for_product(self, product: Product, average_product_price):
        if product.get_price() == -1:
            return 5
        return product.get_price() / average_product_price + self.calculate_innovation_weight(product)
    
    def calculate_innovation_weight(self, product):
        # ToDo implement some logic here
        return 1

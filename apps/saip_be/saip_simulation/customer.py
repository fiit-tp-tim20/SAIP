from dataclasses import dataclass
from abc import ABC, abstractmethod
from typing import Dict
from ..saip_simulation.product import Product, DailyProduct, LastingProduct


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
        
    def calc_weights_for_all_products(self):
        average_price = self.calc_average_product_price(self.product_dict)
        weights = {}
        weight_sum = 0
        for key, product in self.product_dict.items():
            weights[key] = self.calc_weight_for_product(product.get_price(), average_price)
            weight_sum += weights.get(key)
        return self.normalise_weights(weights, weight_sum)
    
    def normalise_weights(self, weights, weight_sum):
        normalised_weights = {}
        for product, weight in weights.items():
            normalised_weights[product] = weight/weight_sum
        return normalised_weights
            
    @abstractmethod
    def calc_weight_for_product(self, product_price, average_product_price):
        pass
    

@dataclass
class HighBudgetCustomer(Customer):
    
    def calc_weight_for_product(self, product_price, average_product_price):
        return (product_price / average_product_price)**2


@dataclass
class LowBudgetustomer(Customer):
    
    def calc_weight_for_product(self, product_price, average_product_price):
        return (average_product_price / product_price)**2


@dataclass
class AverageBudgetCustomer(Customer):
    
    def calc_weight_for_product(self, product_price, average_product_price):
        return product_price / average_product_price


@dataclass
class InovationsLover(Customer):
    
    def calc_weights_for_all_products(self):
        average_price = self.calc_average_product_price(self.product_dict)
        weights = {}
        weight_sum = 0
        for key, product in self.product_dict.items():
            weights[key] = self.calc_weight_for_product(product.get_price(), average_price) + self.calculate_innovation_weight(product)
            weight_sum += weights.get(key)
        return self.normalise_weights(weights, weight_sum)
    
    def calc_weight_for_product(self, product_price, average_product_price):
        return product_price / average_product_price
    
    def calculate_innovation_weight(self):
        # ToDo implement some logic here
        return 0

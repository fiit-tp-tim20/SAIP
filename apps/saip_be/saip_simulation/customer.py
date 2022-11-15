from dataclasses import dataclass
from typing import List
from abc import ABC, abstractmethod

from product import Product
from company import Company

@dataclass
class Customer(ABC):
    modifier: float
    
    @abstractmethod
    def calculate_weight_for_product(self, product:Product, all_products:List[Product]):
        pass
    @abstractmethod
    def calculate_weight_for_company(self, company:Company, all_companies:List[Company]):
        pass

    def calculate_average_price(all_companies:List[Company]) -> float:
        sum = 0
        for company in all_companies:
            sum += company.get_product().get_price()
        sum /= len(all_companies)
        return sum
    

#TODO - implement customer behaviour - how their interest in a product is calculated
@dataclass
class HighBudgetCustomer(Customer):
    pass


@dataclass
class LowBudgetustomer(Customer):
    pass


@dataclass
class AverageBudgetCustomer(Customer):
    pass


@dataclass
class InovationsLover(Customer):
    pass

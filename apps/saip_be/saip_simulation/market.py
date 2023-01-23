from dataclasses import dataclass
from typing import List, Dict
from math import floor

from .product import Product, LastingProduct
from .company import Company, Factory
from .customer import Customer, HighBudgetCustomer, AverageBudgetCustomer, LowBudgetustomer, InovationsLover
from .marketing import OOH
from .config import MarketPreset



@dataclass
class Market:
    # loan_limit: int         #limit on loans (in dollars/euros)
    # interest_rate: int      #percentage
    # tax_rate: int           #percentage

    marketing_percentage: int   #percentage of market that is interesed in marketing
    rnd_percentage: int         #percentage of market that is interesed in rnd
    price_percentage: int       #percentage of market that is interesed in price

    customer_count: int      #overall number of potential customers
    customer_base: List[Customer]
    customer_distribution = Dict[str, int]
    
    companies: List[Company]
    products: Dict[str, Product]

    #TODO add sensitivity to attribute(marketing, rnd, price)(maybe)
    
    def __init__(self, companies, customer_count=None) -> None:
        self.companies = companies
        self.customer_base = []
        self.products = {}
        self.customer_distribution= {}
        
        self.customer_count = MarketPreset.STARTING_CUSTOMER_COUNT if customer_count is None else customer_count
        self.rnd_percentage = MarketPreset.INTERESTED_IN_RND
        self.marketing_percentage = MarketPreset.INTERESTED_IN_MARKETING
        self.price_percentage = MarketPreset.INTERESTED_IN_PRICE
        self.__generate_product_dict()      
        self.generate_demand()

    def generate_demand(self):
        base_investment = MarketPreset.BASE_MARKETING_INVESTMENT * len(self.companies)
        total_investment_from_companies = self.__get_total_investment_from_companies()
        self.customer_count += floor(total_investment_from_companies / base_investment * MarketPreset.STARTING_CUSTOMER_COUNT)
        
        for i in range(self.customer_count):
            # self.customer_base.append(Customer(self.products))  # only generating basic customer for now
            if i < self.customer_count * self.rnd_percentage:
                self.customer_base.append(InovationsLover(self.products))
                continue
            if i < (self.customer_count * self.rnd_percentage + self.customer_count * self.marketing_percentage):
                self.customer_base.append(HighBudgetCustomer(self.products))
                continue
            if i < (self.customer_count * self.rnd_percentage + self.customer_count * self.marketing_percentage + self.customer_count * self.price_percentage):
                self.customer_base.append(LowBudgetustomer(self.products))
                continue
            self.customer_base.append(AverageBudgetCustomer(self.products))       
                
    def __generate_product_dict(self):
        for company in self.companies:
            self.products[company.brand] = company.product
        self.products["no_purchase"] = LastingProduct(None, -1, -1)
            
    def __get_total_investment_from_companies(self):
        total_investment = 0
        for company in self.companies:
            total_investment += company.yield_agg_marketing_value()
        return total_investment
    
    def generate_distribution(self) -> Dict:
        for customer in self.customer_base:
            customer_choice = customer.choose_product()
            if self.customer_distribution.get(customer_choice) is None:
                self.customer_distribution[customer_choice] = 0
            self.customer_distribution[customer_choice] += 1
        return self.customer_distribution
    
if __name__ == '__main__':
    comA = Company('A', LastingProduct(None, 1000, -1), 0, 0, 0, 0, 10000, 10000, Factory(), 0, {})
    comB = Company('B', LastingProduct(None, 1050, -1), 0, 0, 0, 0, 10000, 10000, Factory(), 0, {})
    comC = Company('C', LastingProduct(None, 900, -1), 0, 0, 0, 0, 10000, 10000, Factory(), 0, {})
    comD = Company('D', LastingProduct(None, 1200, -1), 0, 0, 0, 0, 10000, 10000, Factory(), 0, {"ooh": OOH(1500)})
    companies = [comA, comB, comC, comD]
    
    mar = Market(companies)
    print(mar.generate_distribution())
    print(f"total = {sum(mar.customer_distribution.values())}")
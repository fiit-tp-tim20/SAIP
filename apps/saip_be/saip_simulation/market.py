import sys
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict
from math import floor

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]

if str(root) not in sys.path:
    sys.path.append(str(root))

# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError:  # Already removed
    pass


from saip_simulation.product import Product, LastingProduct
from saip_simulation.company import Company, Factory
from saip_simulation.customer import (
    Customer,
    HighBudgetCustomer,
    AverageBudgetCustomer,
    LowBudgetustomer,
    InovationsLover,
)
from saip_simulation.marketing import OOH, SocialMedia
from saip_simulation.config import MarketPreset


@dataclass
class Market:
    # loan_limit: int         #limit on loans (in dollars/euros)
    # interest_rate: int      #percentage
    # tax_rate: int           #percentage

    marketing_percentage: int  # percentage of market that is interesed in marketing
    rnd_percentage: int  # percentage of market that is interesed in rnd
    price_percentage: int  # percentage of market that is interesed in price

    customer_count: int  # overall number of potential customers
    customer_base: List[Customer]
    customer_distribution = Dict[str, Dict[str, int]]

    companies: List[Company]
    products: Dict[str, Product]

    # TODO add sensitivity to attribute(marketing, rnd, price)(maybe)

    def __init__(self, companies, customer_count=None) -> None:
        self.companies = companies
        self.customer_base = []
        self.products = {}
        self.customer_distribution = {}

        self.customer_count = (
            MarketPreset.STARTING_CUSTOMER_COUNT
            if customer_count is None
            else customer_count
        )
        self.rnd_percentage = MarketPreset.INTERESTED_IN_RND
        self.marketing_percentage = MarketPreset.INTERESTED_IN_MARKETING
        self.price_percentage = MarketPreset.INTERESTED_IN_PRICE
        self.__generate_product_dict()
        self.generate_demand()

    def generate_demand(self):
        base_investment = MarketPreset.BASE_MARKETING_INVESTMENT * len(self.companies)
        total_investment_from_companies = self.__get_total_investment_from_companies()
        self.customer_count += floor(
            total_investment_from_companies
            / base_investment
            * MarketPreset.STARTING_CUSTOMER_COUNT
        )

        for i in range(self.customer_count):
            # self.customer_base.append(Customer(self.products))  # only generating basic customer for now
            if i < self.customer_count * self.rnd_percentage:
                self.customer_base.append(InovationsLover(self.products))
                continue
            if i < (
                self.customer_count * self.rnd_percentage
                + self.customer_count * self.marketing_percentage
            ):
                self.customer_base.append(HighBudgetCustomer(self.products))
                continue
            if i < (
                self.customer_count * self.rnd_percentage
                + self.customer_count * self.marketing_percentage
                + self.customer_count * self.price_percentage
            ):
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
                self.customer_distribution[customer_choice] = {"demand": 0}
            self.customer_distribution[customer_choice]["demand"] += 1
        self.calculate_sales_per_company()
        return self.customer_distribution

    def calculate_sales_per_company(self):
        for company in self.companies:
            self.customer_distribution[company.brand][
                "demand_not_met"
            ] = company.sell_product(
                self.customer_distribution.get(company.brand).get("demand")
            )


if __name__ == "__main__":
    comA = Company("A", LastingProduct(None, 1000, -1), 0, 85, 0, 10000, Factory(), {})
    comB = Company("B", LastingProduct(None, 1100, -1), 0, 82, 0, 10000, Factory(), {})
    comC = Company(
        "C",
        LastingProduct(None, 900, -1),
        0,
        90,
        0,
        10000,
        Factory(),
        {"social": SocialMedia(3000)},
    )
    comD = Company(
        "D",
        LastingProduct(None, 1200, -1),
        0,
        95,
        0,
        10000,
        Factory(),
        {"ooh": OOH(1500)},
    )
    companies = [comA, comB, comC, comD]
    for company in companies:
        if company.brand == "A" or company.brand == "B":
            company.factory.invest_into_factory(5000)
        elif company.brand == "D":
            company.factory.invest_into_factory(2500)
        else:
            company.factory.invest_into_factory(0)
        company.produce_products()

    mar = Market(companies)
    print(f"\nMARKET STATE: {mar.generate_distribution()}")
    print(
        f"\nTOTAL DEMAND: {sum([item.get('demand') for item in mar.customer_distribution.values()])}"
    )
    print(
        f"REMAINING CUSTOMERS: {sum([item.get('demand_not_met', 0) for item in mar.customer_distribution.values()]) + mar.customer_distribution.get('no_purchase', {}).get('demand', 0)}\n"
    )

    for company in companies:
        print(
            f"COMPANY {company.brand} \nNet Worth: {company.factory.capital_investment} | Units Sold: {company.units_sold}"
        )
        print(
            f"Selling Price: {company.product.get_price()} | Costs Per Unit: {company.factory.calculate_price_per_unit(company.production_volume):.2f} | Income Per Unit: {company.product.get_price() - company.factory.calculate_price_per_unit(company.production_volume):.2f}"
        )
        print(
            f"Total Income: {company.income_per_turn:.2f} | Total Costs: {company.costs_per_turn:.2f} | Profit: {company.profit:.2f}"
        )
        print(
            f"Marketing: {company.yield_agg_marketing_value():.2f} | Stock price: {company.calculate_stock_price():.2f}\n"
        )

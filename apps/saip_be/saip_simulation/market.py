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
    marketing_percentage: int  # percentage of market that is interesed in marketing
    rnd_percentage: int  # percentage of market that is interesed in rnd
    price_percentage: int  # percentage of market that is interesed in price

    customer_count: int  # overall number of potential customers
    customer_base: List[Customer]
    customer_distribution = Dict[str, Dict[str, int]]

    companies: List[Company]
    products: Dict[str, Product]

    def __init__(self, companies, customer_count=None) -> None:
        self.companies = companies
        self.customer_base = []
        self.products = {}
        self.customer_distribution = {}

        self.customer_count = (
            MarketPreset.STARTING_CUSTOMER_COUNT * len(self.companies)
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
            * len(self.companies)
        )

        for i in range(self.customer_count):
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
        for company in self.companies:
            self.customer_distribution[company.brand] = {"demand": 0}
        for customer in self.customer_base:
            customer_choice = customer.choose_product()
            if self.customer_distribution.get(customer_choice) is None:
                self.customer_distribution[customer_choice] = {"demand": 0}
            self.customer_distribution[customer_choice]["demand"] += 1
        self.__calculate_sales_per_company()
        return self.customer_distribution

    def __calculate_sales_per_company(self):
        for company in self.companies:
            self.customer_distribution[company.brand][
                "demand_not_met"
            ] = company.sell_product(
                self.customer_distribution.get(company.brand).get("demand")
            )
            company.calculate_stock_price()


#########################
#   TESTING UTILITIES   #
#########################


def print_market_state(mar: Market):
    print(f"\nMARKET STATE: {mar.generate_distribution()}")
    print(
        f"\nTOTAL DEMAND: {sum([item.get('demand') for item in mar.customer_distribution.values()])}"
    )
    total_unmet_demand = sum(
        [item.get("demand_not_met", 0) for item in mar.customer_distribution.values()]
    )
    print(
        f"REMAINING CUSTOMERS: {total_unmet_demand + mar.customer_distribution.get('no_purchase', {}).get('demand', 0)}\n"
    )

    average_price = sum([com.product.get_price() for com in mar.companies]) / len(
        mar.companies
    )
    print(
        f"AVERAGE PRODUCT PRICE: {average_price} | +25%: {average_price*1.25} | +50%: {average_price*1.5}\n"
    )

    return total_unmet_demand


def print_company(company: Company):

    print(f"COMPANY {company.brand} \nNet Worth: {company.factory.capital_investment}")
    print(
        f"Capacity: {company.factory.capacity} | Writeoff: {company.factory.upkeep.get('writeoff')}"
    )
    print(
        f"Units Made: {company.production_volume} | Units Sold: {company.units_sold} | Inventory: {company.inventory}"
    )
    print(f"Rent: {company.factory.upkeep.get('rent')} | Energy: {company.factory.upkeep.get('energy')} | Salaries: {company.factory.upkeep.get('salaries')} | Materials: {company.factory.upkeep.get('materials')}")
    ipu = company.product.get_price() - company.total_ppu
    print(
        f"Selling Price: {company.product.get_price()} | Prod PPU: {company.prod_ppu:.2f} | Total PPU: {company.total_ppu:.2f} | Income Per Unit: {ipu:.2f}"
    )
    print(
        f"Total Income: {company.income_per_turn:.2f} | Production Costs: {company.prod_costs_per_turn:.2f} | Total Costs: {company.total_costs_per_turn:.2f}"
    )
    print(
        f"Profit (before tax): {company.profit_before_tax:.2f} | Profit (after tax): {company.profit:.2f} | Tax paid: {company.value_paid_in_tax:.2f}"
    )
    print(
        f"Remaining budget: {company.remaining_budget:.2f} | Next Turn Budget: {company.next_turn_budget:.2f} | Required for next Turn: {company.max_budget - company.remaining_budget}"
    )
    print(
        f"Loan repayment: {company.value_paid_in_loan_repayment:.2f} | New loans: {company.new_loans:.2f} | Remaining loans: {company.loans:.2f}"
    )
    print(f"Marketing value: {company.yield_agg_marketing_value()}")
    print(f"Balance: {company.balance:.2f} | Stock price: {company.stock_price:.2f}\n")


########################
#   TESTING SCENARIO   #
########################

if __name__ == "__main__":

    TURN_COUNT = 1

    comA = Company(
        brand="A",
        product=LastingProduct(None, 1800, 250),
        inventory=0,
        production_volume=85,
        balance=0,
        factory=Factory(),
        marketing={},
    )
    comB = Company(
        brand="B",
        product=LastingProduct(None, 2500, 250),
        inventory=0,
        production_volume=82,
        balance=0,
        factory=Factory(),
        marketing={},
    )
    comC = Company(
        brand="C",
        product=LastingProduct(None, 1950, 250),
        inventory=0,
        production_volume=90,
        balance=0,
        factory=Factory(),
        marketing={"social": SocialMedia(3000)},
    )
    comD = Company(
        brand="D",
        product=LastingProduct(None, 1700, 250),
        inventory=0,
        production_volume=99,
        balance=0,
        factory=Factory(),
        marketing={"ooh": OOH(10000)},
    )
    companies = [comA, comB, comC, comD]

    mar = Market(companies)

    for i in range(TURN_COUNT):
        print(f"TURN {i+1}")
        for company in companies:
            if i != 0:
                company.factory.update_upkeep()
                company.start_of_turn_cleanup()
            if company.brand == "A" or company.brand == "B":
                company.factory.invest_into_factory(5000)
                company.remaining_budget -= 5000
            elif company.brand == "D":
                company.factory.invest_into_factory(2500)
                company.remaining_budget -= 2500
            else:
                company.factory.invest_into_factory(0)
            company.produce_products()

        next_turn_customers = print_market_state(mar)

        for company in companies:
            print_company(company)

        mar.customer_count = next_turn_customers
        mar.generate_demand()

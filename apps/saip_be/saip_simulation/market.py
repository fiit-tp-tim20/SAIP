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
            sales = self.customer_distribution[company.brand].get(
                "demand", 0
            ) - self.customer_distribution[company.brand].get("demand_not_met", 0)
            self.customer_count -= sales


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


def print_company_production(company: Company):
    print("---------- PRODUCTION ----------")
    print(
        f"Vyrobenych: {company.production_volume}\nKapacita: {company.factory.capacity}\nVyuzitie: {company.production_volume / company.factory.prev_capacity:.2f}"
    )
    print(
        f"Variabilne naklady: {company.prod_costs_per_turn:.2f}/ks\nZasoby: {company.inventory}\nCelkove naklady: {company.total_ppu:.2f}/ks"
    )


def print_company_sales(company: Company):
    print("------------ SALES -------------")
    print(
        f"Objednavky: {company.demand}\nSplnene: {company.units_sold}\nNesplnene: {company.demand_not_met}\nPredajna cena: {company.product.get_price()}"
    )


def print_company_cashflow(company: Company):
    print("----------- CASHFLOW -----------")
    print(
        f"Pociatocny stav: {company.prev_balance:.2f}\nPrijmy: {company.income_per_turn}\nVydavky na vyrobu: {company.prod_costs_per_turn:.2f}"
    )
    print(
        f"Vydavky na zasoby: {company.value_paid_in_inventory_charge}\nVydavky na rozhodnutia: {company.decision_costs}"
    )
    print(
        f"Vydavky na uroky: {company.value_paid_in_interest:.2f}\nDan: {company.value_paid_in_tax:.2f}"
    )
    print(
        f"Vysledok financneho toku: {company.cashflow_result:.2f}\nSplatka uveru: {company.value_paid_in_loan_repayment:.2f}\nKonecny stav: {company.balance:.2f}"
    )


def print_company_incomes_and_losses(company: Company):
    print("------- INCOMES & LOSSES -------")
    print(
        f"Prijmy: {company.income_per_turn}\nNaklady na predane vyrobky: {company.cost_of_goods_sold:.2f}\nMarketing: {company.marketing_costs}"
    )
    print(
        f"RnD: {company.amount_spent_on_upgrades}\nOdpisy: {company.factory.upkeep.get('writeoff'):.2f}\nVydavky na zasoby: {company.value_paid_in_inventory_charge}"
    )
    print(
        f"Upgrade zasob: {company.value_paid_in_stored_product_upgrades:.2f}\nPrecenenie zasob: {company.price_diff_stored_products:.2f}\nUroky: {company.value_paid_in_interest:.2f}"
    )
    print(
        f"Vysledok pred zdanenim: {company.profit_before_tax:.2f}\nDan: {company.value_paid_in_tax:.2f}\nVysledok po zdaneni: {company.profit_after_tax:.2f}"
    )


def print_company_stats(company: Company):
    print("------------ SUVAHA ------------")

    print("AKTIVA")
    print(
        f"Cash: {company.balance:.2f}\nZasoby: {company.inventory*company.prod_ppu}\nKapitalove investicie: {company.factory.capital_investment:.2f}"
    )
    print(
        f"Sucet aktiv: {company.balance + (company.inventory*company.prod_ppu) + company.factory.capital_investment:.2f}"
    )

    print("PASIVA")
    imanie = 40_000
    print(
        f"Pozicky: {company.loans:.2f}\nVysledok hospodarenia: {company.profit_after_tax:.2f}\nZakladne imanie: {imanie}"
    )
    print(f"Sucet pasiv: {company.loans + company.profit_after_tax + imanie:.2f}\n\n")


def print_company(company: Company):
    print(f"COMPANY {company.brand}")
    print_company_production(company)
    print_company_sales(company)
    print_company_cashflow(company)
    print_company_incomes_and_losses(company)
    print_company_stats(company)


########################
#   TESTING SCENARIO   #
########################

if __name__ == "__main__":

    TURN_COUNT = 1

    comA = Company(
        brand="A",
        product=LastingProduct(price=1800, man_cost=250),
        inventory=0,
        production_volume=85,
        balance=10_000,
        factory=Factory(),
        marketing={},
        capital_investment_this_turn=5000,
    )
    comB = Company(
        brand="B",
        product=LastingProduct(price=2500, man_cost=250),
        inventory=0,
        production_volume=82,
        balance=10_000,
        factory=Factory(),
        marketing={},
        capital_investment_this_turn=5000,
    )
    comC = Company(
        brand="C",
        product=LastingProduct(price=1950, man_cost=250),
        inventory=0,
        production_volume=90,
        balance=10_000,
        factory=Factory(),
        marketing={"social": SocialMedia(3000)},
    )
    comD = Company(
        brand="D",
        product=LastingProduct(price=1700, man_cost=250),
        inventory=0,
        production_volume=99,
        balance=10_000,
        factory=Factory(),
        marketing={"ooh": OOH(7500)},
        capital_investment_this_turn=2500,
    )
    companies = [comA, comB, comC, comD]

    mar = Market(companies)

    for i in range(TURN_COUNT):
        print(f"TURN {i+1}")
        for company in companies:
            if i != 0:
                company.factory.update_upkeep()
                company.start_of_turn_cleanup()
            company.produce_products()
            company.invest_into_factory()

        next_turn_customers = print_market_state(mar)

        for company in companies:
            print_company(company)

        mar.customer_count = next_turn_customers
        mar.generate_demand()

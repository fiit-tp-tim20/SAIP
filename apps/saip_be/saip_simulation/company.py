import sys
from pathlib import Path

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]

if str(root) not in sys.path:
    sys.path.append(str(root))

# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError:  # Already removed
    pass

from dataclasses import dataclass, field
from typing import List

from saip_simulation.product import Product, DailyProduct, LastingProduct
from saip_simulation.marketing import *
from saip_simulation.config import TURN_LENGTH, FactoryPreset, CompanyPreset
from saip_simulation.marketing import MarketingType

from typing import Dict
from math import ceil, floor


@dataclass
class Factory:
    capital_investment: float = FactoryPreset.STARTING_INVESTMENT
    capital_investment_this_turn: float = 0.0
    capacity: int = FactoryPreset.STARTING_CAPACITY

    # to be changed to list (or multiple attributes) after we implement different employees
    employees: int = FactoryPreset.STARTING_EMPLOYEES
    employee_salary: float = FactoryPreset.BASE_SALARY

    base_energy_cost: float = FactoryPreset.BASE_ENERGY_COST

    upkeep = {
        "rent": float,
        "energy": float,
        "salaries": float,  # employees * salary * 3 (length of turn)
        "materials": float,  # this one might be irrelevant
        "writeoff": float,
    }
    inflation = FactoryPreset.BASE_INFLATION

    def __post_init__(self):
        self.update_upkeep(FactoryPreset.BASE_RENT, 0)

    def update_upkeep(
        self, new_rent: float = None, materials_cost: float = None, skip: bool = False
    ) -> None:
        if new_rent:
            self.upkeep["rent"] = new_rent
        if materials_cost:
            self.upkeep["materials"] = materials_cost

        if skip is False:
            self.upkeep["energy"] = self.__calculate_energies()
            self.upkeep["salaries"] = self.__calculate_salaries()
            self.upkeep["writeoff"] = (
                self.capital_investment * FactoryPreset.FACTORY_WRITEOFF_RATE
            )
            return

        for key, value in self.upkeep.items():  # apply inflation
            if key == "writeoff":
                continue
            self.upkeep[key] += value * self.inflation

    def total_upkeep(self) -> float:
        return (
            self.upkeep.get("rent")
            + self.upkeep.get("energy")
            + self.upkeep.get("salaries")
            + self.upkeep.get("materials")
        )

    def calculate_price_per_unit(self, production_this_turn: int) -> float:
        self.update_upkeep(
            materials_cost=FactoryPreset.BASE_MATERIAL_COST_PER_UNIT
            * production_this_turn,
            skip=True,
        )
        ppu = self.total_upkeep() / production_this_turn
        cap_usage = production_this_turn / self.capacity

        if cap_usage > FactoryPreset.OPTIMAL_THRESHOLD:
            return self.__price_per_unit_over_optimal(cap_usage, ppu)

        return round(ppu, 2)

    def invest_into_factory(self, investment: int) -> None:
        self.__devalue_capital()
        self.capital_investment += investment
        self.capacity += floor(
            self.capital_investment
            - FactoryPreset.STARTING_INVESTMENT
            / FactoryPreset.STARTING_INVESTMENT
            * FactoryPreset.STARTING_CAPACITY
        )
        self.update_upkeep()

    def __devalue_capital(self) -> None:
        self.capital_investment = round(
            self.capital_investment - self.upkeep.get("writeoff"), 2
        )

    def __calculate_energies(self) -> float:
        return self.base_energy_cost

    def __calculate_salaries(self) -> float:
        return self.employee_salary * self.employees * TURN_LENGTH

    def _price_per_unit(
        self, production_this_turn: int
    ) -> float:  # used in unit tests only
        return self.total_upkeep() / production_this_turn

    def __price_per_unit_over_optimal(self, cap_usage: float, ppu: float) -> float:
        over_threshold = ceil((cap_usage - FactoryPreset.OPTIMAL_THRESHOLD) * 100)
        return ppu * FactoryPreset.OVER_THRESHOLD_MULTIPLIER**over_threshold


@dataclass
class Company:
    brand: str = ""
    product: Product = None

    inventory: int = (
        0  # assuming that the stored products are upgraded automatically, for a price
    )
    production_volume: int = 0
    prod_ppu: float = field(init=False)
    total_ppu: float = field(init=False)

    balance: float = 0  # current state of the company finances
    profit: float = field(init=False)  # +income -costs | per turn only
    loans: float = FactoryPreset.STARTING_INVESTMENT
    interest_rate: float = CompanyPreset.DEFAULT_INTEREST_RATE
    tax_rate = CompanyPreset.DEFAULT_TAX_RATE

    income_per_turn: float = 0  # field(init=False)
    prod_costs_per_turn: float = 0  # field(init=False)
    total_costs_per_turn: float = 0  # field(init=False)

    max_budget: float = CompanyPreset.DEFAULT_BUDGET_PER_TURN
    remaining_budget: float = field(init=False)

    stock_price: float = 0  # field(init=False)  # company score
    units_sold: int = 0  # field(init=False)

    factory: Factory = None
    marketing: Dict[str, MarketingType] = field(default_factory=dict)

    def __post_init__(self):
        self.remaining_budget = self.max_budget
        self.pay_for_marketing()

    def pay_for_marketing(self):
        for marketing_type in self.marketing.values():
            self.remaining_budget -= marketing_type.investment

    def upgrade_stored_products(self) -> None:
        self.total_costs_per_turn += (
            self.inventory * self.product.get_upgrade_stored_products_price()
        )

    def calculate_stock_price(self) -> float:
        self.__update_loans()

        self.stock_price = (
            self.factory.capital_investment
            + self.balance * 0.2  # long term performance
            + self.profit * 0.3  # per turn performance
            - self.loans * 0.5  # log term debt
            + self.yield_agg_marketing_value()
        ) / 1000

    def get_product(self):
        return self.product

    def yield_agg_marketing_value(self) -> float:
        return self.__agg_marketing_values()

    def __agg_marketing_values(self) -> float:
        total_investment = 0
        for marketing_type in self.marketing.values():
            total_investment += marketing_type.yield_value()
        return total_investment

    def __agg_marketing_costs(self) -> float:
        total_investment = 0
        for marketing_type in self.marketing.values():
            total_investment += marketing_type.investment
        return total_investment

    def produce_products(self) -> None:
        if self.production_volume > self.factory.capacity:
            self.production_volume = self.factory.capacity

        self.prod_ppu = self.factory.calculate_price_per_unit(self.production_volume)
        self.total_ppu = (
            self.prod_ppu + self.__agg_marketing_costs() / self.production_volume
        )

        self.inventory += self.production_volume
        self.prod_costs_per_turn = self.production_volume * self.prod_ppu
        self.total_costs_per_turn = self.production_volume * self.total_ppu

    def sell_product(self, demand: int) -> int:
        if demand > self.inventory:
            self.income_per_turn = self.inventory * self.product.get_price()
            self.profit = self.income_per_turn - self.total_costs_per_turn
            self.apply_tax()
            self.balance += self.profit + self.remaining_budget
            demand_not_met = demand - self.inventory
            self.units_sold = self.inventory
            self.inventory = 0
            return demand_not_met

        self.income_per_turn = demand * self.product.get_price()
        self.profit = self.income_per_turn - self.total_costs_per_turn
        self.apply_tax()
        self.balance += self.profit + self.remaining_budget
        self.units_sold = demand
        self.inventory -= demand
        return 0

    def apply_tax(self):
        self.profit = self.profit * (1 - self.tax_rate)

    def __update_loans(self):
        self.balance -= self.loans * self.interest_rate
        if self.balance < 0:
            self.loans -= self.balance
            self.balance = 0

        if self.balance < self.max_budget:
            self.loans += self.max_budget - self.balance
            self.balance = 0
            return

        if (self.balance - self.max_budget) > self.loans:
            self.balance -= self.loans + self.max_budget
            self.loans = 0
            return

        self.loans -= self.balance - self.max_budget
        self.balance = 0


if __name__ == "__main__":
    com = Company(
        brand="blank",
        product=LastingProduct(None, 1200, -1),
        inventory=0,
        production_volume=95,
        balance=0,
        factory=Factory(),
        marketing={"ooh": OOH(1500)},
    )

    unitsA = int(FactoryPreset.STARTING_CAPACITY * 0.81)
    unitsB = int(FactoryPreset.STARTING_CAPACITY * 0.9)
    unitsC = int(FactoryPreset.STARTING_CAPACITY * 0.99)

    print("TESTING FACTORY")
    ppuA = com.factory.calculate_price_per_unit(unitsA)
    ppuB = com.factory.calculate_price_per_unit(unitsB)
    ppuC = com.factory.calculate_price_per_unit(unitsC)
    print(
        f"A:{unitsA} ppu:{ppuA:.2f} \nB:{unitsB} ppu:{ppuB:.2f} \nC:{unitsC} ppu:{ppuC:.2f}"
    )

    print("\nTESTING PRODUCTION")
    com.production_volume = unitsA
    com.produce_products()
    print(com.total_costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsB
    com.produce_products()
    print(com.total_costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsC
    com.produce_products()
    print(com.total_costs_per_turn, com.factory.total_upkeep())

    print("\nTESTING INVESTMENT")
    investment = 10_000
    print(f"investing {investment}")
    print(f"old cap: {com.factory.capacity}")
    com.factory.invest_into_factory(investment)
    print(f"new cap: {com.factory.capacity}")

    ppuA = com.factory.calculate_price_per_unit(unitsA)
    ppuB = com.factory.calculate_price_per_unit(unitsB)
    ppuC = com.factory.calculate_price_per_unit(unitsC)
    print(
        f"A:{unitsA} ppu:{ppuA:.2f} \nB:{unitsB} ppu:{ppuB:.2f} \nC:{unitsC} ppu:{ppuC:.2f}"
    )

    com.production_volume = unitsA
    com.produce_products()
    print(com.total_costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsB
    com.produce_products()
    print(com.total_costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsC
    com.produce_products()
    print(com.total_costs_per_turn, com.factory.total_upkeep())

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


class CompanyError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(self.message)


class ProductionOVerCapacityError(CompanyError):
    def __init__(self, production: int, capacity: int) -> None:
        self.message = f"Production {production} is over current capacity {capacity}"
        super().__init__(self.message)


class NoProductionError(CompanyError):
    def __init__(self, production: int) -> None:
        self.message = f"Cannot produce {production} products"
        super().__init__(self.message)


@dataclass
class Factory:
    capital_investment: float = FactoryPreset.STARTING_INVESTMENT
    capacity: int = FactoryPreset.STARTING_CAPACITY

    # to be changed to list (or multiple attributes) after we implement different employees
    employees: int = FactoryPreset.STARTING_EMPLOYEES
    employee_salary: float = FactoryPreset.BASE_SALARY

    base_energy_cost: float = FactoryPreset.BASE_ENERGY_COST
    energy_cost_per_machine: float = FactoryPreset.ENERGY_COST_PER_MACHINE
    machine_count: int = FactoryPreset.STARTING_MACHINES

    upkeep = {
        "rent": float,
        "energy": float,
        "salaries": float,  # employees * salary * 3 (length of turn)
        "materials": float,  # this one might be irrelevant
        "writeoff": float,
    }

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

    def total_upkeep(self) -> float:
        return (
            self.upkeep.get("rent")
            + self.upkeep.get("energy")
            + self.upkeep.get("salaries")
            + self.upkeep.get("materials")
        )

    def calculate_price_per_unit(self, production_this_turn: int) -> float:
        if production_this_turn == 0:
            raise NoProductionError(production_this_turn)

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

    def invest_into_machines(self, machine_count_increase: int) -> None:
        self.machine_count += machine_count_increase
        self.capacity += floor(
            machine_count_increase
            * FactoryPreset.STARTING_CAPACITY
            / FactoryPreset.STARTING_MACHINES
        )
        self.update_upkeep()

    def __calculate_energies(self) -> float:
        return self.base_energy_cost + self.energy_cost_per_machine * self.machine_count

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
    

    profit: float = 0  # +income -costs| represents whether or not the company is actually in dept / turning profit
    loans: float = 0
    interest_rate: float = CompanyPreset.DEFAULT_INTEREST_RATE
    income_per_turn: float = 0 #field(init=False)
    costs_per_turn: float = 0 #field(init=False)

    max_budget: float = 0
    remaining_budget: float = 0  # field(init=False)

    stock_price: float = 0  # field(init=False)  # company score
    units_sold: int = 0  # field(init=False)

    factory: Factory = None
    marketing: Dict[str, MarketingType] = field(default_factory=dict)

    def upgrade_stored_products(self) -> None:
        self.costs_per_turn += self.inventory * self.product.get_upgrade_price()

    def calculate_stock_price(self) -> float:
        self.__update_loan()
        
        self.stock_price = (
            self.factory.capital_investment
            + self.profit * 0.3
            - self.loans * 0.5
            + self.yield_agg_marketing_value()
        ) / 1000
        return self.stock_price

    def get_product(self):
        return self.product

    def load_marketing_dict(self) -> None:
        # TODO some logic here
        self.marketing = {}

    def yield_agg_marketing_value(self) -> float:
        return self._agg_market_values()

    def _agg_market_values(self) -> float:
        total_investment = 0
        for marketing_type in self.marketing.values():
            total_investment += marketing_type.yield_value()
        return total_investment

    def produce_products(self) -> None:
        if self.production_volume > self.factory.capacity:
            raise ProductionOVerCapacityError(
                self.production_volume, self.factory.capacity
            )
        # TODO: make it so that we produce max capacity if production volume is higher
        # note: change the production_volume to max capacity value and write

        ppu = self.factory.calculate_price_per_unit(self.production_volume)
        total_price = self.production_volume * ppu

        self.inventory += self.production_volume
        self.costs_per_turn = total_price

    def sell_product(self, demand: int) -> int:
        if demand > self.inventory:
            self.income_per_turn = self.inventory * self.product.get_price()
            self.profit = self.income_per_turn - self.costs_per_turn
            demand_not_met = demand - self.inventory
            self.units_sold = self.inventory
            self.inventory = 0
            return demand_not_met

        self.income_per_turn = demand * self.product.get_price()
        self.profit = self.income_per_turn - self.costs_per_turn
        self.units_sold = demand
        self.inventory -= demand
        return 0
    
    def __update_loan(self):
        self.loans = self.loans * self.interest_rate
        if self.profit < 0: 
            self.loans -= self.profit  # alebo nejaku pravidelnu ciastku napr. 10K?
            self.profit = 0
        self.loans -= self.remaining_budget


if __name__ == "__main__":
    com = Company("blank", None, 0, 0, 0, 10000, Factory(), {})

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
    print(com.costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsB
    com.produce_products()
    print(com.costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsC
    com.produce_products()
    print(com.costs_per_turn, com.factory.total_upkeep())

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
    print(com.costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsB
    com.produce_products()
    print(com.costs_per_turn, com.factory.total_upkeep())

    com.production_volume = unitsC
    com.produce_products()
    print(com.costs_per_turn, com.factory.total_upkeep())

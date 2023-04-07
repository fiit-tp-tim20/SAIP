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
from saip_simulation.config import (
    TURN_LENGTH,
    YEAR_LENGTH,
    FactoryPreset,
    CompanyPreset,
)
from saip_simulation.marketing import MarketingType

from typing import Dict
from math import ceil, floor


@dataclass
class Factory:
    capital_investment: float = FactoryPreset.STARTING_INVESTMENT
    capacity: int = FactoryPreset.STARTING_CAPACITY

    employees: int = field(init=False, default=FactoryPreset.STARTING_EMPLOYEES)
    employee_salary: float = field(init=False, default=FactoryPreset.BASE_SALARY)
    base_energy_cost: float = field(init=False, default=FactoryPreset.BASE_ENERGY_COST)

    upkeep: dict[str, float] = field(init=False)
    inflation: float = FactoryPreset.BASE_INFLATION

    def __post_init__(self):
        self.upkeep = {
            "rent": 0.0,
            "energy": 0.0,
            "salaries": 0.0,
            "materials": 0.0,
            "writeoff": 0.0,
        }
        self.update_upkeep(FactoryPreset.BASE_RENT, 0)

    def update_upkeep(
        self, new_rent: float = None, materials_cost: float = None, skip: bool = False
    ) -> None:
        if new_rent:
            self.upkeep["rent"] = new_rent
        if materials_cost:
            self.upkeep["materials"] = materials_cost
            for key, value in self.upkeep.items():  # apply inflation
                if key == "writeoff":
                    continue
                self.upkeep[key] += value * self.inflation

        if skip is False:
            self.upkeep["energy"] = self.__calculate_energies()
            self.upkeep["salaries"] = self.__calculate_salaries()
            self.upkeep["writeoff"] = (
                self.capital_investment * FactoryPreset.FACTORY_WRITEOFF_RATE
            )
            return

    def total_upkeep(self) -> float:
        return (
            self.upkeep.get("rent")
            + self.upkeep.get("energy")
            + self.upkeep.get("salaries")
            + self.upkeep.get("materials")
        )

    def calculate_price_per_unit(
        self,
        production_this_turn: int,
        material_cost: float = FactoryPreset.BASE_MATERIAL_COST_PER_UNIT,
    ) -> float:
        if production_this_turn <= 0:
            return 0.0

        self.update_upkeep(
            materials_cost=(material_cost * production_this_turn),
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
        self.prev_capacity = self.capacity
        self.capacity = FactoryPreset.STARTING_CAPACITY + floor(
            (self.capital_investment - FactoryPreset.STARTING_INVESTMENT)
            / FactoryPreset.STARTING_INVESTMENT
            * FactoryPreset.STARTING_CAPACITY
        )

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

    inventory: int = 0
    production_volume: int = 0
    prod_ppu: float = 0  # field(init=False)
    total_ppu: float = 0  # field(init=False)

    balance: float = 10_000  # current state of the company finances
    profit: float = 0  # field(init=False)  # +income -costs | per turn only
    profit_before_tax: float = 0  # field(init=False)
    profit_after_tax: float = 0  # field(init=False)
    ret_earnings: float = 0  # field(init=False)

    loans: float = 20_000
    loan_limit: float = 20_000
    interest_rate: float = CompanyPreset.DEFAULT_INTEREST_RATE
    value_paid_in_loan_repayment: float = field(init=False)
    new_loans: float = field(init=False)

    tax_rate: float = CompanyPreset.DEFAULT_TAX_RATE
    value_paid_in_tax: float = 0  # field(init=False)

    value_paid_in_interest: float = field(init=False)
    price_diff_stored_products: float = field(init=False)
    value_paid_in_stored_product_upgrades: float = field(init=False)
    value_paid_in_inventory_charge: float = 0  # field(init=False)

    income_per_turn: float = 0  # field(init=False)
    prod_costs_per_turn: float = 0  # field(init=False)
    total_costs_per_turn: float = 0  # field(init=False)
    cost_of_goods_sold: float = field(init=False)

    max_budget: float = CompanyPreset.DEFAULT_BUDGET_PER_TURN
    remaining_budget: float = CompanyPreset.DEFAULT_BUDGET_PER_TURN
    next_turn_budget: float = 0

    stock_price: float = 0  # field(init=False)  # company score
    units_sold: int = 0  # field(init=False)

    prev_turn_prod_ppu: float = 0
    prev_turn_total_ppu: float = 0
    prev_turn_inventory: float = 0
    prev_turn_cash: float = 0
    amount_spent_on_upgrades: float = 0

    factory: Factory = None
    capital_investment_this_turn: float = 0
    marketing: Dict[str, MarketingType] = field(default_factory=dict)

    def __post_init__(self):
        pass  # self.start_of_turn_cleanup()

    ###############################
    #   VISIBLE (CALL IN ORDER)   #
    ###############################

    def produce_products(self) -> None:  # 1
        if self.production_volume > self.factory.capacity:
            self.production_volume = self.factory.capacity

        self.prod_ppu = self.factory.calculate_price_per_unit(
            self.production_volume, self.product.get_man_cost()
        )

        self.__calculate_additional_costs()

        if self.production_volume <= 0:
            self.total_ppu = 0
            self.prod_costs_per_turn = self.factory.total_upkeep()
            self.total_costs_per_turn = self.prod_costs_per_turn + self.additional_costs

        else:
            additional_ppu = self.additional_costs / self.production_volume
            self.total_ppu = self.prod_ppu + additional_ppu

            self.prod_costs_per_turn = self.production_volume * self.prod_ppu
            self.total_costs_per_turn = self.production_volume * self.total_ppu

    def sell_product(self, demand: int) -> int:  # 2
        self.demand = demand
        if self.demand > self.inventory:
            self.income_per_turn = self.inventory * self.product.get_price()
            self.demand_not_met = self.demand - self.inventory
            self.units_sold = self.inventory
            self.inventory = 0
        else:
            self.income_per_turn = self.demand * self.product.get_price()
            self.units_sold = self.demand
            self.inventory -= self.demand
            self.demand_not_met = 0

        self.cost_of_goods_sold = self.units_sold * self.prod_ppu

        self.profit = (
            self.income_per_turn - self.cost_of_goods_sold - self.additional_costs
        )
        self.__apply_tax()
        self.__calculate_negative_cashflow()

        self.prev_balance = self.balance
        self.balance += self.income_per_turn - self.negative_cashflow
        self.cashflow_result = self.balance
        self.__update_loans()

        return self.demand_not_met

    def calculate_stock_price(self) -> float:  # 3
        self.stock_price = (
            self.factory.capital_investment
            + self.balance * 0.2  # long term performance
            + self.profit * 0.3  # per turn performance
            - self.loans * 0.5  # long term debt
            + self.yield_agg_marketing_value()
        ) / 1000

    ##########################################
    #   VISIBLE (NO NEED TO CALL IN ORDER)   #
    ##########################################

    def get_product(self):
        return self.product

    def yield_agg_marketing_value(self) -> float:
        return self.__agg_marketing_values()

    def start_of_turn_cleanup(self):
        self.__pay_for_marketing()
        self.__pay_for_rnd()

    def invest_into_factory(self):
        self.factory.invest_into_factory(self.capital_investment_this_turn)
        self.remaining_budget -= (
            self.capital_investment_this_turn - self.factory.upkeep.get("writeoff", 0)
        )

    ###########################
    #   MARKETING UTILITIES   #
    ###########################

    def __pay_for_marketing(self):
        self.remaining_budget -= self.__agg_marketing_costs()

    def __pay_for_rnd(self):
        self.remaining_budget -= self.amount_spent_on_upgrades

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

    ###########################
    #   INVENTORY UTILITIES   #
    ###########################

    def __upgrade_stored_products(self) -> float:
        return self.inventory * self.product.get_upgrade_stored_products_price()

    def __price_diff_stored_products(self) -> float:
        return (self.prev_turn_prod_ppu - self.prod_ppu) * self.inventory

    ###########################
    #   COST CALC UTILITIES   #
    ###########################

    def __calculate_additional_costs(self) -> None:
        self.marketing_costs = self.__agg_marketing_costs()
        self.value_paid_in_interest = (
            self.loans * self.interest_rate * TURN_LENGTH / YEAR_LENGTH
        )
        self.price_diff_stored_products = self.__price_diff_stored_products()
        self.value_paid_in_stored_product_upgrades = self.__upgrade_stored_products()

        self.inventory += self.production_volume
        self.value_paid_in_inventory_charge = (
            self.inventory * FactoryPreset.INVENTORY_CHARGE_PER_UNIT
        )

        self.additional_costs = (
            self.factory.upkeep.get("writeoff")
            + self.marketing_costs
            + self.amount_spent_on_upgrades
            + self.value_paid_in_interest
            + self.price_diff_stored_products
            + self.value_paid_in_stored_product_upgrades
            + self.value_paid_in_inventory_charge
        )

    def __calculate_negative_cashflow(self) -> None:
        self.writeoff = self.factory.upkeep.get("writeoff", 0)

        # investment_costs = 0
        # if self.capital_investment_this_turn > self.writeoff:
        #     investment_costs = self.capital_investment_this_turn - self.writeoff

        self.decision_costs = (
            self.marketing_costs + self.amount_spent_on_upgrades + self.capital_investment_this_turn
        )
        self.negative_cashflow = (
            self.prod_costs_per_turn
            + self.value_paid_in_inventory_charge
            + self.decision_costs
            + self.value_paid_in_interest
            + self.value_paid_in_tax
        )

    def __apply_tax(self):
        if self.profit <= 0:
            self.profit_before_tax = self.profit
            self.profit_after_tax = self.profit
            self.value_paid_in_tax = 0
        else:
            self.profit_before_tax = self.profit
            self.profit_after_tax = self.profit * (1 - self.tax_rate)
            self.value_paid_in_tax = self.profit - self.profit_after_tax
            self.profit = self.profit_after_tax

    def __update_loans(self):
        self.new_loans = 0
        self.value_paid_in_loan_repayment = 0
                
        if self.balance < self.max_budget:
            required_for_next_turn = self.max_budget - self.balance
            if self.loan_limit > required_for_next_turn:
                self.new_loans += required_for_next_turn
                self.loans += required_for_next_turn
                self.balance = self.max_budget
            else:
                self.new_loans += self.loan_limit
                self.loans += self.loan_limit
                self.balance += self.loan_limit
            return

        balance_over_budget = self.balance - self.max_budget
        if balance_over_budget > self.loans:
            self.balance -= self.loans
            self.value_paid_in_loan_repayment += self.loans
            self.loans = 0
            return

        if balance_over_budget > 0:
            self.value_paid_in_loan_repayment += balance_over_budget
            self.loans -= self.value_paid_in_loan_repayment
            self.balance -= self.value_paid_in_loan_repayment


########################
#   TESTING SCENARIO   #
########################

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
    ppuA = com.factory.calculate_price_per_unit(unitsA, com.product.get_man_cost())
    ppuB = com.factory.calculate_price_per_unit(unitsB, com.product.get_man_cost())
    ppuC = com.factory.calculate_price_per_unit(unitsC, com.product.get_man_cost())
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

    ppuA = com.factory.calculate_price_per_unit(unitsA, com.product.get_man_cost())
    ppuB = com.factory.calculate_price_per_unit(unitsB, com.product.get_man_cost())
    ppuC = com.factory.calculate_price_per_unit(unitsC, com.product.get_man_cost())
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

from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from typing import Dict

@dataclass
class Upgrade:
    status: str
    progress: int
    total_cost: int
    sales_effect: float  # modifier for expected value increase
    man_cost_effect: float  # modifier for manufacturing cost increase
    upgraded_this_turn: bool


@dataclass
class Product(ABC):
    upgrades: Dict[str, Upgrade] = field(default_factory=dict)
    price: float = 0
    man_cost: float = 0
    _upgrade_sales_effect_multiplier: float = field(init=False, default=1)
    _upgrade_man_cost_effect_multiplier: float = field(init=False, default=1)
    _upgrade_stored_products_price: float = field(init=False, default=0)
    company: object = field(init=False, default=None)
    marketing_value: float = field(init=False, default=0.0)

    def set_price(self, new_price: float) -> None:
        self.price = new_price

    def get_price(self) -> float:
        return self.price

    def set_man_cost(self, new_man_cost: float) -> None:
        self.man_cost = new_man_cost

    def get_man_cost(self) -> float:
        return self.man_cost

    def _set_upgrade_sales_effect_multiplier(self):
        sum = 0
        for upgrade in self.upgrades.values():
            sum += upgrade.sales_effect
        self._upgrade_sales_effect_multiplier = sum

    def _set_upgrade_man_cost_effect_multiplier(self):
        sum = 0
        for upgrade in self.upgrades.values():
            sum += upgrade.man_cost_effect
        self._upgrade_man_cost_effect_multiplier = 1 + sum
        self.man_cost = self.man_cost * self.get_upgrade_man_cost_effect_multiplier()

    def get_upgrade_sales_effect_multiplier(self):
        return self._upgrade_sales_effect_multiplier

    def get_upgrade_man_cost_effect_multiplier(self):
        return self._upgrade_man_cost_effect_multiplier

    def _set_upgrade_stored_products_price(self, new_upgrade_price: float) -> None:
        self._upgrade_stored_products_price = new_upgrade_price

    def get_upgrade_stored_products_price(self) -> float:
        return self._upgrade_stored_products_price

    def add_upgrade(
        self, name, status, progress, total_cost, sales_effect, man_cost_effect, upgraded_this_turn
    ):
        self.upgrades[name] = Upgrade(
            status=status,
            progress=progress,
            total_cost=total_cost,
            sales_effect=sales_effect,
            man_cost_effect=man_cost_effect,
            upgraded_this_turn = upgraded_this_turn # True/False
        )
        #print(self.upgrades)

    def setup_product(self):
        self._set_upgrade_man_cost_effect_multiplier()
        self._set_upgrade_sales_effect_multiplier()

    def upgrade_stored_products(self):
        self._perform_upgrade_logic()
        self._set_upgrade_stored_products_price(self._calculate_upgrade_price())

    def attach_company(self, company):
        self.company = company
        self.marketing_value += company.yield_agg_marketing_value()

    @abstractmethod
    def _calculate_upgrade_price(self) -> float:
        pass

    @abstractmethod
    def _perform_upgrade_logic(self):
        pass


@dataclass
class DailyProduct(Product):
    pass


@dataclass
class LastingProduct(Product):
    # ToDo replace dummy logic (used in testing) witch actual code

    def _calculate_upgrade_price(self) -> float:
        upgrade_multiplier = 0
        for upgrade in self.upgrades.values():
            upgrade_multiplier += upgrade.man_cost_effect if upgrade.upgraded_this_turn is True else 0
        return self.man_cost * upgrade_multiplier

    def _perform_upgrade_logic(self) -> None:
        pass

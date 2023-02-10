from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from typing import Dict


@dataclass
class Upgrade:
    status: bool
    progress: int
    total_cost: int
    sales_effect: float  # modifier for expected value increase
    man_cost_effect: float  # modifier for manufacturing cost increase


@dataclass
class Product(ABC):
    upgrades: Dict[str, Upgrade] = field(default_factory=dict)
    __price: float = 0
    __upgrade_sales_effect_multiplier: float = 1
    __upgrade_man_cost_effect_multiplier: float = 1
    __upgrade_stored_products_price: float = 0

    def set_price(self, new_price: float) -> None:
        self.__price = new_price

    def _set_upgrade_sales_effect_multiplier(self):
        sum = 0
        for upgrade in self.upgrades.values():
            sum+= upgrade.sales_effect
        self.__upgrade_sales_effect_multiplier = 1 + sum
    
    def _set_upgrade_man_cost_effect_multiplier(self):
        sum = 0
        for upgrade in self.upgrades.values():
            sum += upgrade.man_cost_effect
        self.__upgrade_man_cost_effect_multiplier = 1 + sum

    def get_upgrade_sales_effect_multiplier(self):
        return self.__upgrade_sales_effect_multiplier
    
    def get_upgrade_man_cost_effect_multiplier(self):
        return self.__upgrade_man_cost_effect_multiplier

    def get_price(self) -> float:
        return self.__price

    def _set_upgrade_stored_products_price(self, new_upgrade_price: float) -> None:
        self._set_upgrade_stored_products_price = new_upgrade_price

    def get_upgrade_stored_products_price(self) -> float:
        return self.__upgrade_stored_products_price

    def add_upgrade(
        self, name, status, progress, total_cost, sales_effect, man_cost_effect
    ):
        self.upgrades[name] = Upgrade(
            status=status,
            progress=progress,
            total_cost=total_cost,
            sales_effect=sales_effect,
            man_cost_effect=man_cost_effect,
        )


    def upgrade_stored_products(self):
        self._perform_upgrade_logic()
        self._set_upgrade_stored_products_price(self._calculate_upgrade_price())

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
        return self.__price / 10

    def _perform_upgrade_logic(self) -> None:
        self.__price = self.__price * 1.1

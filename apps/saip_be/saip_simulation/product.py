from dataclasses import dataclass
from abc import ABC, abstractmethod


@dataclass 
class Upgrade:
    status: bool
    progress: int
    total_cost: int
    effect: float  # modifier for expected value increase


@dataclass
class Product(ABC):
    upgrades: dict = None
    _price: float = 0
    _upgrade_price: float = 0

    def set_price(self, new_price: float) -> None:
        self._price = new_price

    def get_price(self) -> float:
        return self._price

    def _set_upgrade_price(self, new_upgrade_price: float) -> None:
        self._set_upgrade_price = new_upgrade_price

    def get_upgrade_price(self) -> float:
        return self._upgrade_price

    def upgrade_stored_products(self):
        self._perform_upgrade_logic()
        self._set_upgrade_price(self._calculate_upgrade_price())

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
        return self._price / 10

    def _perform_upgrade_logic(self) -> None:
        self._price = self._price * 1.1

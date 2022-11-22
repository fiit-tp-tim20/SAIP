from dataclasses import dataclass
from abc import ABC, abstractmethod


@dataclass
class Product(ABC):
    upgrades: dict = None
    __price: float = 0
    __upgrade_price: float = 0
    
    def set_price(self, new_price: float) -> None:
        self.__price = new_price
        
    def get_price(self) -> float:
        return self.__price
    
    def _set_upgrade_price(self, new_upgrade_price) -> None:
        self._set_upgrade_price = new_upgrade_price
    
    def get_upgrade_price(self) -> float:
        return self.__upgrade_price
    
    def upgrade_product(self):
        self._perform_upgrade_logic()
        new_upgrade_price = self._calculate_upgrade_price()
        self._set_upgrade_price(new_upgrade_price)
        
    @abstractmethod
    def _calculate_upgrade_price(self):
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

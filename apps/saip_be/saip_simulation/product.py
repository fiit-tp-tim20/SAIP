from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class Product(ABC):
    upgrades: dict
    __price: float
    __upgrade_price: float
    
    def set_price(self, new_price: float) -> None:
        self.__price = new_price
        
    def get_price(self) -> float:
        return self.__price
    
    def __set_upgrade_price(self, new_upgrade_price) -> None:
        self.__set_upgrade_price = new_upgrade_price
    
    def get_upgrade_price(self) -> float:
        return self.__upgrade_price
    
    def upgrade_product(self):
        # ToDo add upgrade logic here
        new_upgrade_price = 0
        self.__set_upgrade_price(new_upgrade_price)
        
    def __post_init__(self):
        if self.__class__ == Product:
            raise TypeError("Cannot instantiate abstract class.")


@dataclass
class DailyProduct(Product):
    pass


@dataclass
class LongTermProduct(Product):
    pass
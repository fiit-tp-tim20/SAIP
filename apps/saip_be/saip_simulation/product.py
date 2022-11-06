from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class Product(ABC):
    upgrade_price: float
    upgrades: dict


@dataclass
class DailyProduct(Product):
    pass


@dataclass
class LongTermProduct(Product):
    pass
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class Product(ABC):
    pass


@dataclass
class DailyProduct(Product):
    pass


@dataclass
class LongTermProduct(Product):
    pass
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class Customer(ABC):
    modifier: float
    
    @abstractmethod
    def calculate_weight_for_product(self, average_product_price):
        pass
    
    

from dataclasses import dataclass

from product import Product, DailyProduct, LongTermProduct

@dataclass
class Company:
    product: Product
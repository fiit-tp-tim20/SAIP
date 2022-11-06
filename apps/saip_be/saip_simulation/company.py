from dataclasses import dataclass

from product import Product, DailyProduct, LastingProduct


@dataclass
class Factory:
    capacity: int
    upkeep: float    


@dataclass
class Company:
    product: Product
    storage_count: int  # assuming that the stored products are upgraded automatically, for a price
    debit: float
    credit: float  # debit and credit are mutually exclusive, one should be always zero
    profit: float  # per turn, add to either credit or debit
    max_budget: float
    remaining_budget: float
    
    def upgrade_stored_products(self):
        pass
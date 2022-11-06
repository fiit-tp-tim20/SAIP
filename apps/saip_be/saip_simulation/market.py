from dataclasses import dataclass
from typing import List

from customer import Customer

@dataclass
class Market:
    customers: List[Customer]
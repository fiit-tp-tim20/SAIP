from dataclasses import dataclass
from typing import List

from customer import Customer


@dataclass
class Market:
    customers: List[Customer]

    loan_limit: int         #limit on loans (in dollars/euros)
    interest_rate: int      #percentage
    tax_rate: int           #percentage

    marketing_percentage: int   #percentage of market that is interesed in marketing
    rnd_percentage: int         #percentage of market that is interesed in rnd
    price_percentage: int       #percentage of market that is interesed in price

    customer_base: int      #overall number of potential customers

    #TODO add sensitivity to attribute(marketing, rnd, price)(maybe)

from dataclasses import dataclass

@dataclass
class MarketingType:
    cost: int                   #cost per unit per month
    amount_invested: int        #total investment of the company into this type of marketing
    effectivity_modifier: float #the weight of this type of marketing

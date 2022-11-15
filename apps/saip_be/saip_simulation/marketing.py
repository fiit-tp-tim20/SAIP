from dataclasses import dataclass

@dataclass
class MarketingType:
    ideal_investment_range: tuple(float, float) # ideal range of investment
    amount_invested: int                        # total investment of the company into this type of marketing
    effectivity_modifier: float                 # the weight of this type of marketing

    # getters 
    def get_ideal_investment_range(self):
        return self.ideal_investment_range

    def get_amount_invested(self):
        return self.amount_invested

    def get_effectivity_modifier(self):
        return self.effectivity_modifier
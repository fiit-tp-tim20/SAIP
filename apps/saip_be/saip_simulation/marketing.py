import sys
from pathlib import Path

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]
sys.path.append(str(root))

# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError: # Already removed
    pass


from dataclasses import dataclass
from abc import ABC, abstractmethod
from saip_simulation.config import MarketingModifiers, MarketingInvestments


class MarketingError(Exception):
    
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(self.message)


class MinimalInvestmentError(MarketingError):

    def __init__(self, investment):
        self.message = f"Minimal investment is {investment}"
        super().__init__(self.message)
        
class MaximalInvestmentError(MarketingError):

    def __init__(self, investment):
        self.message = f"Maximal investment is {investment}"
        super().__init__(self.message)


@dataclass
class MarketingType(ABC):
    investment: float
        
    @abstractmethod
    def yield_value(self) -> float:
        pass
    
    @abstractmethod
    def _calculate_effectivity(self) -> float:
        pass
    

class SocialMedia(MarketingType):
    
    def __init__(self, investment):
        if investment < MarketingInvestments.SOCIAL_MEDIA_MIN:
            raise MinimalInvestmentError(MarketingInvestments.SOCIAL_MEDIA_MIN)
        if investment > MarketingInvestments.SOCIAL_MEDIA_MAX:
            raise MaximalInvestmentError(MarketingInvestments.SOCIAL_MEDIA_MAX)
        self.investment = investment
    
    def yield_value(self):
        return self.investment * self._calculate_effectivity() * MarketingModifiers.SOCIAL_MEDIA_BASE * self._bonus_modifier()
    
    def _calculate_effectivity(self):
        return 0.7 + self._calculate_effectivity_over_minimum()
    
    def _calculate_effectivity_over_minimum(self):
        return (
            0.3 * \
            (self.investment - MarketingInvestments.SOCIAL_MEDIA_MIN) / \
            (MarketingInvestments.SOCIAL_MEDIA_MAX  - MarketingInvestments.SOCIAL_MEDIA_MIN)    
        )
    
    def _bonus_modifier(self):
        return 1 + self.investment / MarketingInvestments.SOCIAL_MEDIA_STEP * MarketingModifiers.SOCIAL_MEDIA_BONUS


class Billboard(MarketingType):
    
    def __init__(self, investment):
        if investment < MarketingInvestments.BILLBOARD_MIN:
            raise MinimalInvestmentError(MarketingInvestments.BILLBOARD_MIN)
        if investment > MarketingInvestments.BILLBOARD_MAX:
            raise MaximalInvestmentError(MarketingInvestments.BILLBOARD_MAX)
        self.investment = investment
    
    def yield_value(self):
        return self.investment * self._calculate_effectivity() * MarketingModifiers.BILLBOARD
    
    def _calculate_effectivity(self):
        return 0.7 + self._calculate_effectivity_over_minimum()
    
    def _calculate_effectivity_over_minimum(self):
        return (
            0.3 * \
            (self.investment - MarketingInvestments.BILLBOARD_MIN) / \
            (MarketingInvestments.BILLBOARD_MAX  - MarketingInvestments.BILLBOARD_MIN)    
        )


class CableNews(MarketingType):
    
    def __init__(self, investment):
        if investment < MarketingInvestments.CABLE_NEWS_MIN:
            raise MinimalInvestmentError(MarketingInvestments.CABLE_NEWS_MIN)
        if investment > MarketingInvestments.CABLE_NEWS_MAX:
            raise MaximalInvestmentError(MarketingInvestments.CABLE_NEWS_MAX)
        self.investment = investment
    
    def yield_value(self):
        return self.investment * self._calculate_effectivity() * MarketingModifiers.CABLE_NEWS
    
    def _calculate_effectivity(self):
        return 0.7 + self._calculate_effectivity_over_minimum()
    
    def _calculate_effectivity_over_minimum(self):
        return (
            0.3 * \
            (self.investment - MarketingInvestments.CABLE_NEWS_MIN) / \
            (MarketingInvestments.CABLE_NEWS_MAX  - MarketingInvestments.CABLE_NEWS_MIN)    
        )


class Podcast(MarketingType):
    
    def __init__(self, investment):
        if investment < MarketingInvestments.PODCAST_MIN:
            raise MinimalInvestmentError(MarketingInvestments.PODCAST_MIN)
        if investment > MarketingInvestments.PODCAST_MAX:
            raise MaximalInvestmentError(MarketingInvestments.PODCAST_MAX)
        self.investment = investment
    
    def yield_value(self):
        return self.investment * self._calculate_effectivity() * MarketingModifiers.PODCAST
    
    def _calculate_effectivity(self):
        return 0.7 + self._calculate_effectivity_over_minimum()
    
    def _calculate_effectivity_over_minimum(self):
        return (
            0.3 * \
            (self.investment - MarketingInvestments.PODCAST_MIN) / \
            (MarketingInvestments.PODCAST_MAX  - MarketingInvestments.PODCAST_MIN)    
        )


class OOH(MarketingType):
    
    def __init__(self, investment):
        if investment < MarketingInvestments.OOH_MIN:
            raise MinimalInvestmentError(MarketingInvestments.OOH_MIN)
        if investment > MarketingInvestments.OOH_MAX:
            raise MaximalInvestmentError(MarketingInvestments.OOH_MAX)
        self.investment = investment
    
    def yield_value(self):
        return self.investment * self._calculate_effectivity() * MarketingModifiers.OOH
    
    def _calculate_effectivity(self):
        return 0.7 + self._calculate_effectivity_over_minimum()
    
    def _calculate_effectivity_over_minimum(self):
        return (
            0.3 * \
            (self.investment - MarketingInvestments.OOH_MIN) / \
            (MarketingInvestments.OOH_MAX  - MarketingInvestments.OOH_MIN)    
        )

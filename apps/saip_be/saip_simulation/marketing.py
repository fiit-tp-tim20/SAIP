from dataclasses import dataclass
from abc import ABC, abstractmethod
from config import MarketingModifiers, MarketingInvestments


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
        return 0.7 + (self.investment - MarketingInvestments.SOCIAL_MEDIA_MIN) / MarketingInvestments.SOCIAL_MEDIA_MAX
    
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
        return 0.7 + (self.investment - MarketingInvestments.BILLBOARD_MIN) / MarketingInvestments.BILLBOARD_MAX


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
        return 0.7 + (self.investment - MarketingInvestments.CABLE_NEWS_MIN) / MarketingInvestments.CABLE_NEWS_MAX


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
        return 0.7 + (self.investment - MarketingInvestments.PODCAST_MIN) / MarketingInvestments.PODCAST_MAX

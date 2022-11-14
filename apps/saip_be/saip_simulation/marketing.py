from dataclasses import dataclass
from abc import ABC, abstractmethod
from config import MarketingModifiers

@dataclass
class MarketingType(ABC):
    investment: float
    
    @abstractmethod
    def yield_value(self):
        pass
    

@dataclass
class SocialMedia(MarketingType):
    
    def yield_value(self):
        return self.investment * MarketingModifiers.SOCIAL_MEDIA
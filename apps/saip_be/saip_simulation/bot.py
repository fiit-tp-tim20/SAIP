import sys
from abc import abstractmethod, ABC
from dataclasses import dataclass, field
from pathlib import Path
import requests
from django.contrib.auth.forms import UserCreationForm

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]

if str(root) not in sys.path:
    sys.path.append(str(root))

# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError:  # Already removed
    pass

from saip_simulation.company import *
from saip_simulation.product import Product, DailyProduct, LastingProduct
from saip_simulation.marketing import *
from saip_simulation.config import *
from saip_simulation.config import (
    TURN_LENGTH,
    YEAR_LENGTH,
    FactoryPreset,
    CompanyPreset,
)

from typing import Dict, Any
from math import ceil, floor
# from saip_api.models import Company
import saip_api.models as models



DECISIONS_PRESET =    {
                      "marketing": {
                        "viral": 0,
                        "podcast": 0,
                        "ooh": 0,
                        "tv": 0,
                        "billboard": 0
                      },
                      "production": {
                        "sell_price": 0,
                        "volume": 0
                      },
                      "factory": {
                        "capital": 0
                      },
                      "brakes": 0,
                      "frame": 0,
                      "battery": 0,
                      "display": 0
                    }
AVG_PRICE_PRESET = 800
MAX_PRICE_PRESET = 1000

VITE_BACKEND_URL='http://127.0.0.1:8000/api'
# VITE_BACKEND_URL='https://saip.sk/api'

@dataclass
class Bot(ABC):
    name: float = "Bot"
    total_budget: float = CompanyPreset.DEFAULT_BUDGET_PER_TURN
    # capital_investment: int = 0
    # marketing_investments: dict[str, int] = field(default_factory=dict)
    # upgrade_investments: int = 0
    # product_price: int = 0
    decisions: dict = field(default_factory=lambda: DECISIONS_PRESET)

    inventory_count: int = 0
    avg_price: float = AVG_PRICE_PRESET
    # min_price: float = FactoryPreset.BASE_MATERIAL_COST_PER_UNIT
    min_price: float = (FactoryPreset.BASE_MATERIAL_COST_PER_UNIT + \
                       (FactoryPreset.BASE_RENT +
                        FactoryPreset.BASE_ENERGY_COST +
                        FactoryPreset.STARTING_EMPLOYEES * FactoryPreset.BASE_SALARY * TURN_LENGTH)/\
                       (FactoryPreset.STARTING_CAPACITY*FactoryPreset.OPTIMAL_THRESHOLD))*1.05
    factory_value: float = FactoryPreset.STARTING_INVESTMENT
    token: str = None

    @abstractmethod
    def calculate_capital_investments(self,**kwargs):
        pass

    @abstractmethod
    def calculate_product_price(self,**kwargs):
        pass

    @abstractmethod
    def calculate_upgrade_investments(self,**kwargs):
        pass

    def calculate_marketing_investments(self,**kwargs):
        other_investments = kwargs.get("other_investments")

        if self.total_budget - other_investments > MarketingInvestments.SOCIAL_MEDIA_MIN:
            marketing_inv = int(self.total_budget - other_investments)
        else:
            marketing_inv = 0

        return marketing_inv

    def calculate_production_volume(self,**kwargs):
        production_rate = kwargs.get("production_rate")

        return int(production_rate * self.factory_value/500)

    def make_decisions(self):
        pass

    def create_bot(self, id,username,passwd):
        self.register(username,passwd)
        self.login(username,passwd)
        self.create_company(id)

    def commit_decisions(self):
        url = VITE_BACKEND_URL + "/spendings/"
        data = self.decisions
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        response = requests.post(url, headers=headers, json=data)
        print(response.json())

    def register(self,username,passwd):

        url = VITE_BACKEND_URL + "/register/"
        data = {
            "username": username,
            "password": passwd
        }
        response = requests.post(url, json=data)
        # print("Response JSON:", response)

    def login(self,username,passwd):
        url = VITE_BACKEND_URL + "/login/"
        data = {
            "username": username,
            "password": passwd
        }
        response = requests.post(url, json=data,)
        # print("Response JSON:", response.json())
        self.token = response.json()["token"]


    def create_company(self,id,name):

        url = VITE_BACKEND_URL + "/create_company/"
        data = {
            "game": id,
            "name": name,
            "participants": self.name
        }
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

        # Make the POST request
        response = requests.post(url, headers=headers, json=data)

    def get_company_report(self,turn_number):

        url = VITE_BACKEND_URL + "/company_report/"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "turn": str(turn_number)
        }
        response = requests.get(url, headers=headers)
        print(response.json())

@dataclass
class LowPriceStrategyBot(Bot):
    name: float = "LowPriceStrategyBot"

    def calculate_inventory_coef (self, **kwargs):
        inventory_count = kwargs.get("inventory_count")
        inventory_coef = inventory_count / 10000 if inventory_count < 10000 else 1

        return inventory_coef

    def calculate_capital_investments(self,**kwargs):
        inventory_count = kwargs.get("inventory_count")
        inventory_coef = self.calculate_inventory_coef(inventory_count=inventory_count)

        return int(self.total_budget * 0.8 - self.total_budget * 0.4 * inventory_coef)

    def calculate_product_price(self,**kwargs):
        inventory_count = kwargs.get("inventory_count")
        avg_price = kwargs.get("avg_price")
        min_price = kwargs.get("min_price")

        inventory_coef = self.calculate_inventory_coef(inventory_count=inventory_count)

        coef = 0.8
        diff_1 = int((avg_price - min_price)/2 * coef)
        diff_2 = int((avg_price - min_price)/4 * (1 - inventory_coef))
        price = avg_price - diff_1 + diff_2
        return price

    def calculate_upgrade_investments(self,**kwargs):
        pass

    def make_decisions(self):
        # "capital investments"
        capital_investments = self.calculate_capital_investments(inventory_count=self.inventory_count)
        self.decisions["factory"]["capital"] = capital_investments

        # marketing investments
        viral_investments = self.calculate_marketing_investments(other_investments=capital_investments)
        self.decisions["marketing"]["viral"] = viral_investments

        # production
        price = self.calculate_product_price(avg_price=self.avg_price,min_price=self.min_price)
        volume = self.calculate_production_volume(production_rate=0.9)
        self.decisions["production"]["sell_price"] = price
        self.decisions["production"]["volume"] = volume

        print(self.decisions)

    def end_turn(self):
        return



@dataclass
class AveragePriceStrategyBot(Bot):
    name: float = "AveragePriceStrategyBot"

    def calculate_capital_investments(self, **kwargs):
        return

    def calculate_product_price(self, **kwargs):
        return

    def calculate_marketing_investments(self, **kwargs):
        return


@dataclass
class HighPriceStrategyBot(Bot):
    name: float = "HighPriceStrategyBot"
    sales_effect_total: float = 0
    max_price: float = MAX_PRICE_PRESET

    def calculate_capital_investments(self, **kwargs):
        return

    def calculate_product_price(self, **kwargs):
        inventory_count = kwargs.get("inventory_count")
        avg_price = kwargs.get("avg_price")
        max_price = kwargs.get("max_price")

        inventory_coef = self.calculate_inventory_coef(inventory_count=inventory_count)

        coef = 0.1
        diff_1 = int((max_price - avg_price) / 2 * coef) if self.sales_effect_total > 0 else 0
        diff_2 = int((max_price - avg_price) / 4 * (1 - inventory_coef))
        diff_3 = int((max_price - avg_price)/2 * self.sales_effect_total)

        price = avg_price + diff_1 - diff_2 + diff_3

        if price > 15000:
            price = 15000

        return price

    def calculate_marketing_investments(self, **kwargs):
        return


# {
#   "marketing": {
#     "viral": 0,
#     "podcast": 0,
#     "ooh": 0,
#     "tv": 0,
#     "billboard": 0
#   },
#   "production": {
#     "sell_price": 0,
#     "volume": 0
#   },
#   "factory": {
#     "capital": 0
#   },
#   "brakes": 0,
#   "frame": 0,
#   "battery": 0,
#   "display": 0
# }

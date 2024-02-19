import sys
from abc import abstractmethod, ABC
from dataclasses import dataclass, field
from pathlib import Path
import requests
import random
import string
import json
from django.contrib.auth.forms import UserCreationForm
from random_username.generate import generate_username

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


def generate_random_string(length=8):
    return ''.join(random.choice(string.ascii_letters) for _ in range(length))


def generate_random_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))


DECISIONS_PRESET ={
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
                      "display": 0,
                    }
AVG_PRICE_PRESET = 800
MAX_PRICE_PRESET = 1000

VITE_BACKEND_URL='http://127.0.0.1:8000/api'
# VITE_BACKEND_URL='https://saip.sk/api'

@dataclass
class Bot(ABC):
    name: float = "Bot"
    type: str = 'B'
    total_budget: float = CompanyPreset.DEFAULT_BUDGET_PER_TURN
    bonus_spendable_cash: float = 0
    # capital_investment: int = 0
    # marketing_investments: dict[str, int] = field(default_factory=dict)
    # upgrade_investments: int = 0
    # product_price: int = 0
    decisions: dict = field(default_factory=lambda: {
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
                      "display": 0,
                    })

    inventory_count: int = 0
    # factory_value: float = FactoryPreset.STARTING_INVESTMENT
    production_capacity: float = FactoryPreset.STARTING_INVESTMENT/500

    avg_price: float = AVG_PRICE_PRESET
    min_price: float = (FactoryPreset.BASE_MATERIAL_COST_PER_UNIT + \
                       (FactoryPreset.BASE_RENT +
                        FactoryPreset.BASE_ENERGY_COST +
                        FactoryPreset.STARTING_EMPLOYEES * FactoryPreset.BASE_SALARY * TURN_LENGTH)/\
                       (FactoryPreset.STARTING_CAPACITY*FactoryPreset.OPTIMAL_THRESHOLD))*1.05
    max_price: float = MAX_PRICE_PRESET
    upgrades:  Dict[int, int] = field(default_factory=lambda: {30000: 0, 34000: 0, 22000: 0, 18000: 0})
    username: str = None
    token: str = None
    company_id: int = 0


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

        return int(production_rate * self.production_capacity)

    def capital_bonus_investments(self,**kwargs):
        p_capacity = self.production_capacity

        inventory_count = kwargs.get("inventory_count")
        m_coef = kwargs.get("m_coef")
        v_coef = kwargs.get("v_coef")

        #priklad kedy bonus = 10000
        bonus = self.bonus_spendable_cash

        if(inventory_count < p_capacity):
            return bonus * m_coef

        elif (inventory_count > 2 * p_capacity):
            return 0

        else:
            return bonus * v_coef





    def make_decisions(self):
        pass

    def get_upgrades(self,**kwargs):
        turn_number = kwargs.get("turn_number")

        url = VITE_BACKEND_URL + "/upgrades/"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        params = {"turn": str(turn_number)}
        response = requests.get(url, headers=headers,params=params)

        if response.status_code == 200:
            # print("Response JSON report:", response.json())
            upgrades = response.json().get("upgrade")

            for upgrade in upgrades:
                price = upgrade.get("price")
                progress = upgrade.get("progress")
                self.upgrades[price] = progress

        else:
            print("Response content:", response.text)


    def add_to_game(self,**kwargs):
        game_id = kwargs.get("game_id")
        self.register()
        self.create_company(id=game_id,name=self.username)
        return self.token

    def commit_decisions(self):
        url = VITE_BACKEND_URL + "/spendings/"
        data = self.decisions
        print(self.decisions)
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        response = requests.post(url, headers=headers, json=data)

    def register(self,username=None,passwd=None):
        generated_name = generate_username()[0]
        if username is None:
            username = str(self.type) + '_' + generated_name + '_' + generate_random_string()
            passwd = generate_random_password()

        url = VITE_BACKEND_URL + "/register/"
        data = {
            "username": username,
            "password": passwd
        }
        response = requests.post(url, json=data)

        if response.status_code == 201:
            self.username = generated_name
            self.login(username=username, passwd=passwd)
        else:
            print("Response content:", response.text)

    def login(self,username,passwd):
        url = VITE_BACKEND_URL + "/login/"
        data = {
            "username": username,
            "password": passwd
        }
        response = requests.post(url, json=data,)

        if response.status_code == 200:
            self.token = response.json()["token"]
        else:
            print("Response content:", response.text)

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

        if response.status_code == 201:
            self.company_id = response.json().get("companyID")
        else:
            print("Response content:", response.text)

    def get_company_report(self,**kwargs):
        turn_number = kwargs.get("turn_number")
        url = VITE_BACKEND_URL + "/company_report/"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        params = {"turn": str(turn_number)}
        response = requests.get(url, headers=headers,params=params)

        if response.status_code == 200:
            # print("Response JSON report:", response.json())
            self.inventory_count = response.json().get("production").get("new_inventory")
            self.production_capacity = response.json().get("production").get("capacity")
        else:
            print("Response content:", response.text)

    def get_company_info(self, **kwargs):
        turn_number = kwargs.get("turn_number")
        url = VITE_BACKEND_URL + "/company_info/"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        params = {"turn": str(turn_number)}
        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            self.bonus_spendable_cash = response.json().get("bonus_spendable_cash")
        else:
            print("Response content:", response.text)

    def get_industry_report(self,**kwargs):
        turn_number = kwargs.get("turn_number")
        url = VITE_BACKEND_URL + "/industry_report/"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        params = {"turn": str(turn_number)}
        response = requests.get(url, headers=headers,params=params)

        if response.status_code == 200:
            # print("Response JSON:", response.json())
            industries = response.json().get("industry")
            price_sum = 0
            max_price = 0
            min_price = 15000
            for industry in industries.items():
                sell_price = industry[1].get('sell_price')
                price_sum += sell_price

                if sell_price > max_price:
                    max_price = sell_price
                if sell_price < min_price:
                    min_price = sell_price

            self.avg_price = price_sum/len(industries)
            self.min_price = min_price
            self.max_price = max_price

        else:
            print("Response content:", response.text)

    def get_committed_status(self,**kwargs):
        turn_number = kwargs.get("turn_number")
        url = VITE_BACKEND_URL + "/committed/"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        params = {"turn": str(turn_number)}
        response = requests.get(url, headers=headers,params=params)

        if response.status_code == 200:
            return response.json().get("committed")
        else:
            print("Response content:", response.text)
            return response.text

    def play_turn(self,**kwargs):
        turn_number = kwargs.get("turn_number")
        if self.get_committed_status(turn_number=turn_number) is False:
            self.get_company_report(turn_number=turn_number - 1)
            self.get_company_info(turn_number=turn_number - 1)
            if turn_number > 1:
                self.get_industry_report(turn_number=turn_number - 1)
                self.get_upgrades(turn_number=turn_number - 1)
            self.make_decisions()
            self.commit_decisions()

@dataclass
class LowPriceStrategyBot(Bot):
    name: float = "LowPriceStrategyBot"
    type: str = 'L'

    def calculate_inventory_coef (self, **kwargs):
        inventory_count = kwargs.get("inventory_count")
        inventory_coef = inventory_count / 10000 if inventory_count < 10000 else 1
        # print("Ahoj")
        return inventory_coef

    def calculate_capital_investments(self,**kwargs):
        inventory_count = kwargs.get("inventory_count")
        inventory_coef = self.calculate_inventory_coef(inventory_count=inventory_count)

        return int(self.total_budget * 0.8 - self.total_budget * 0.4 * inventory_coef)

    def calculate_product_price(self,**kwargs):
        inventory_coef = self.calculate_inventory_coef(inventory_count=self.inventory_count)
        coef = 0.8

        diff_1 = int((self.avg_price - self.min_price)/2 * coef)
        diff_2 = int((self.avg_price - self.min_price)/4 * (1 - inventory_coef))
        price = self.avg_price - diff_1 + diff_2
        return price

    def calculate_upgrade_investments(self,**kwargs):
        pass

    def make_decisions(self):
        print("I am", self.name)

        # "capital investments"
        capital_investments = self.calculate_capital_investments(inventory_count=self.inventory_count)
        self.decisions["factory"]["capital"] = capital_investments

        # marketing investments
        viral_investments = self.calculate_marketing_investments(other_investments=capital_investments)
        self.decisions["marketing"]["viral"] = viral_investments

        # production
        price = self.calculate_product_price()
        volume = self.calculate_production_volume(production_rate=0.9)
        self.decisions["production"]["sell_price"] = round(price)
        self.decisions["production"]["volume"] = volume

        self.capital_bonus_investments(v_coef=0.85, m_coef=1, inventory_count=self.inventory_count)


    def end_turn(self):
        return



@dataclass
class AveragePriceStrategyBot(Bot):
    name: float = "AveragePriceStrategyBot"
    sales_effect_total: float = 0
    type: str = 'A'

    def calculate_capital_investments(self, **kwargs):
        return

    def calculate_inventory_coef (self, **kwargs):
        inventory_count = kwargs.get("inventory_count")
        inventory_coef = inventory_count / 10000 if inventory_count < 10000 else 1

        return inventory_coef

    def calculate_product_price(self, **kwargs):
        inventory_coef = self.calculate_inventory_coef(inventory_count=self.inventory_count)
        diff_2 = int((self.max_price - self.avg_price) / 4 * (1 - inventory_coef))
        diff_3 = int((self.max_price - self.avg_price) / 2 * self.sales_effect_total)

        price = self.avg_price + diff_2 + diff_3

        if price > 15000:
            price = 15000

        return price

    def calculate_marketing_investments(self, **kwargs):
        return

    def calculate_upgrade_investments(self, **kwargs):

        c = 0

        if (self.upgrades[22000] < 22000):
            c = 4400
            self.upgrades[22000] += c
            self.decisions["frame"] = c


        elif (self.upgrades[18000] < 18000):
            c = 3600
            self.upgrades[18000] += c
            self.decisions["brakes"] = c
            self.sales_effect_total = 0.55
            self.decisions["frame"] = 0



        elif (self.upgrades[30000] < 30000):
            c = 3750
            self.upgrades[30000] += c  # tu sa to nepripocita
            self.decisions["battery"] = c
            self.sales_effect_total = 1
            self.decisions["brakes"] = 0


        elif (self.upgrades[34000] < 34000):
            c = 4250
            self.upgrades[34000] += c
            self.decisions["display"] = c
            self.sales_effect_total = 1.75
            self.decisions["battery"] = 0

        else:
            self.sales_effect_total += 2.6

        return c

    def make_decisions(self):

        print("I am", self.name)


        # upgrades
        upgrades = self.calculate_upgrade_investments()
        rest = self.total_budget - upgrades

        if(self.inventory_count <  1000):
            capital_value = rest/2
            marketing_value = rest/2

        elif(self.inventory_count >  1000):
            capital_value = 0
            marketing_value = rest

        # "capital investments"
        #capital_investments = self.calculate_capital_investments(inventory_count=self.inventory_count)
        self.decisions["factory"]["capital"] = capital_value

        # marketing investments
        #viral_investments = self.calculate_marketing_investments(other_investments=marketing_value)
        self.decisions["marketing"]["viral"] = marketing_value

        # production
        price = self.calculate_product_price()
        volume = self.calculate_production_volume(production_rate=0.9)
        self.decisions["production"]["sell_price"] = round(price)
        self.decisions["production"]["volume"] = volume

        self.capital_bonus_investments(v_coef=0.65, m_coef=0.9, inventory_count=self.inventory_count)





@dataclass
class HighPriceStrategyBot(Bot):
    name: float = "HighPriceStrategyBot"
    sales_effect_total: float = 0
    sales_effect_total: float = 0
    type: str = 'H'

    def calculate_capital_investments(self, **kwargs):
        return

    def calculate_inventory_coef (self, **kwargs):
        inventory_count = kwargs.get("inventory_count")
        inventory_coef = inventory_count / 10000 if inventory_count < 10000 else 1

        return inventory_coef

    def calculate_product_price(self, **kwargs):
        inventory_coef = self.calculate_inventory_coef(inventory_count=self.inventory_count)
        coef = 0.1
        diff_1 = int((self.max_price - self.avg_price) / 2 * coef) if self.sales_effect_total > 0 else 0
        diff_2 = int((self.max_price - self.avg_price) / 4 * (1 - inventory_coef))
        diff_3 = int((self.max_price - self.avg_price)/2 * self.sales_effect_total)

        price = self.avg_price + diff_1 + diff_2 + diff_3

        if price > 15000:
            price = 15000

        return price

    def make_decisions(self):

        print("I am", self.name)


        # upgrades
        upgrades = self.calculate_upgrade_investments()
        capital_value = (self.total_budget - upgrades) / 3
        marketing_value = 2 * capital_value

        # "capital investments"
        #capital_investments = self.calculate_capital_investments(inventory_count=self.inventory_count)
        self.decisions["factory"]["capital"] = capital_value



        # marketing investments
        #viral_investments = self.calculate_marketing_investments(other_investments=marketing_value)
        self.decisions["marketing"]["viral"] = marketing_value

        # production
        price = self.calculate_product_price()
        volume = self.calculate_production_volume(production_rate=0.9)
        self.decisions["production"]["sell_price"] = round(price)
        self.decisions["production"]["volume"] = volume

        self.capital_bonus_investments(v_coef=0.45, m_coef=0.8, inventory_count=self.inventory_count)




        """""
        self.decisions["brakes"] = upgrades_decision[18000]
        self.decisions["frame"] = upgrades_decision[22000]
        self.decisions["battery"] = upgrades_decision[30000]
        self.decisions["display"] = upgrades_decision[34000]
        """

    def end_turn(self):
        return

    def calculate_marketing_investments(self, **kwargs):
        return

    def calculate_upgrade_investments(self, **kwargs):


        # print("MOJE:")
        print(self.upgrades)
        #upg_dict = {0.75: 0, 0.85: 0, 0.55: 0, 0.45: 0}

        c = 0

        if (self.upgrades[30000] < 30000):
            c = self.total_budget
            self.upgrades[30000] += c       #tu sa to nepripocita
            self.decisions["battery"] = c

            # print("v podmienke:")
            # print(self.upgrades)


        elif (self.upgrades[34000] < 34000):
            c = 0.85 * self.total_budget
            self.upgrades[34000] += c
            self.decisions["display"] = c
            self.sales_effect_total = 0.75
            self.decisions["battery"] = 0

        elif (self.upgrades[22000] < 22000):
            c = 0.55 * self.total_budget
            self.upgrades[22000] += c
            self.decisions["frame"] = c
            self.sales_effect_total = 1.6
            self.decisions["display"] = 0

        elif (self.upgrades[18000] < 18000):
            c = 0.6 * self.total_budget
            self.upgrades[18000] += c
            self.decisions["brakes"] = c
            self.sales_effect_total = 2.15
            self.decisions["frame"] = 0
        else:
            self.sales_effect_total = 2.6

        return c


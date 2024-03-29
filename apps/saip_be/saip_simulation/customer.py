import sys
from pathlib import Path

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]

if str(root) not in sys.path:
    sys.path.append(str(root))

# Additionally remove the current file's directory from sys.path
try:
    sys.path.remove(str(parent))
except ValueError:  # Already removed
    pass


from dataclasses import dataclass
from abc import ABC, abstractmethod
from typing import Dict
from random import random
from saip_simulation.product import Product, DailyProduct, LastingProduct


@dataclass
class Customer(ABC):
    product_dict: Dict[str, Product]

    def calc_average_product_price(self) -> float:
        total = 0
        count = 0
        try:
            for product in self.product_dict.values():
                if product.get_price() == -1:
                    continue
                total += product.get_price()
                count += 1
            return total / count
        except TypeError as e:
            raise e
        except AttributeError as e:
            raise e

    def calc_weights_for_all_products(self) -> dict:
        average_price = self.calc_average_product_price()
        weights = {}
        weight_sum = 0
        for key, product in self.product_dict.items():
            weights[key] = self.calc_weight_for_product(product, average_price) * \
                           self.calc_weight_from_marketing(product.marketing_value)
            weight_sum += weights.get(key)
        return self.normalise_weights(weights, weight_sum)

    def normalise_weights(self, weights: dict, weight_sum) -> dict:
        normalised_weights = {}
        for product, weight in weights.items():
            if weight_sum == 0:
                normalised_weights[product] = weight / 1
                continue
            normalised_weights[product] = weight / weight_sum
        return normalised_weights

    def choose_product(self):
        choice = random()
        prev = 0
        weights = self.calc_weights_for_all_products()
        for key, value in weights.items():
            if choice < (prev + value):
                return key
            prev += value

    @abstractmethod
    def calc_weight_for_product(self, product_price, average_product_price):
        pass

    @abstractmethod
    def calc_weight_from_marketing(self, marketing_value):
        pass

    @abstractmethod
    def calculate_innovation_weight(self, product: Product):
        pass



# CHANGES - added 'or product_price == 0' condition to all calc_weight_for_product methods
@dataclass
class HighBudgetCustomer(Customer):
    def calc_weight_for_product(self,product: Product, average_product_price):
        if product.get_price() == -1 or product.get_price() == 0:
            return 0.5
        if product.get_price() > 15_000:
            return 0
        if product.get_price() > average_product_price * 1.5:
            return (product.get_price() / average_product_price) ** 2 / 1000
        return ((product.get_price() / average_product_price) ** 2
                + self.calculate_innovation_weight(product))

    def calc_weight_from_marketing(self, marketing_value):
        return 1 + marketing_value / 10_000 * 1.25

    def calculate_innovation_weight(self, product: Product):
        return product.get_upgrade_sales_effect_multiplier()


@dataclass
class LowBudgetustomer(Customer):
    def calc_weight_for_product(self, product: Product, average_product_price):
        if product.get_price() == -1 or product.get_price() == 0:
            return 0.5
        if product.get_price() > 15_000:
            return 0
        if product.get_price() > average_product_price * 1.25:
            return 0
        return (average_product_price / product.get_price()) ** 2

    def calc_weight_from_marketing(self, marketing_value):
        return 1 + marketing_value / 10_000 * 0.4

    def calculate_innovation_weight(self, product: Product):
        pass


@dataclass
class AverageBudgetCustomer(Customer):
    def calc_weight_for_product(self, product: Product, average_product_price):
        if product.get_price() == -1 or product.get_price() == 0:
            return 0.5
        if product.get_price() > 15_000:
            return 0
        if product.get_price() > average_product_price * 1.5:
            return 0.1
        return (0.5 + average_product_price / product.get_price()
                + self.calculate_innovation_weight(product))

    def calc_weight_from_marketing(self, marketing_value):
        return 1 + marketing_value / 10_000

    def calculate_innovation_weight(self, product: Product):
        return 0.8 * product.get_upgrade_sales_effect_multiplier()


@dataclass
class InovationsLover(Customer):
    def calc_weight_for_product(self, product: Product, average_product_price):
        if product.get_price() == -1 or product.get_price() == 0:
            return 0.5
        if product.get_price() > 15_000:
            return 0
        if self.calculate_innovation_weight(product) == 0:      # ak nema spolocnost dokoncene ziadne vylepsenie
            return 0
        if product.get_price() > average_product_price * 1.5:
            return 0.1
        return (
            + average_product_price/product.get_price()
            + self.calculate_innovation_weight(product)         # 1*sum(sales_effect)
        )

    def calculate_innovation_weight(self, product: Product):
        # TODO the logic here may be subject to change
        return 1.2*product.get_upgrade_sales_effect_multiplier()

    def calc_weight_from_marketing(self, marketing_value):
        return 1 + marketing_value / 10_000 * 1.15

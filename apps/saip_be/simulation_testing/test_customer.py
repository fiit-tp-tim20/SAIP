import pytest
from typing import List
from ..saip_simulation.customer import HighBudgetCustomer, AverageBudgetCustomer, LowBudgetustomer, InovationsLover
from ..saip_simulation.product import Product, LastingProduct



class TestCustomer():
    
    def _generate_dict(self, products: List[Product], item_count: int = 0, instruction: str = '') -> dict:
        if instruction != '':
            return self._generate_broken_dict(products, item_count, instruction)
        _normal_set = {}
        total_price = 0
        for i in range(item_count):
            _normal_set[f'product{i}'] = products[i]
            total_price += products[i].get_price()
        average = total_price / item_count
        return {
            'average': average,
            'products': _normal_set
        }
            
    def _generate_broken_dict(self, products: List[Product], item_count: int, instruction: str) -> dict:
        _broken_set = {}
        for i in range(item_count):
            if i == item_count - 1:
                _broken_set[f'product{i}'] = instruction
                break
            _broken_set[f'product{i}'] = products[i]
        return {
            'average': instruction,
            'products': _broken_set
        }
    
    
    @pytest.fixture()
    def setup_product_sets(self):
        print("__________________________________________________SETUP__________________________________________________")

        products = []
        prices = [15, 12, 14, 17, 25, 8]
        
        for val in prices:
            product = LastingProduct()
            product.set_price(val)
            products.append(product)
            
        instructions = [(4, ''), (3, ''), (5, ''), (4, 'expected_failure')]
        
        product_sets = [self._generate_dict(products, item_count, instruction) for item_count, instruction in instructions]
        yield product_sets
        
        print("_________________________________________________TEARDOWN_________________________________________________")
    
    def test_average_product_price(self, setup_product_sets):
        product_sets = setup_product_sets
        
        for product_set in product_sets:
            if isinstance(product_set.get('average'), str):
                with pytest.raises(AttributeError) as e_info:
                    customer = HighBudgetCustomer(product_set.get('products'))
                    calculated_price = customer.calc_average_product_price()
                continue
            customer = HighBudgetCustomer(product_set.get('products'))
            calculated_price = customer.calc_average_product_price()
            assert product_set.get('average') == calculated_price
            
            
    def test_normalised_weights(self):
        pass

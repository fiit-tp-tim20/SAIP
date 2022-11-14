import pytest
from ..saip_simulation.customer import HighBudgetCustomer, AverageBudgetCustomer, LowBudgetustomer, InovationsLover

class TestCustomer():
    
    @pytest.fixture()
    def setup_product_sets(self):
        print("setup")
        product_sets = [
            {
                'average': (15+12+14+17)/4,
                'products': {
                    'product1': 15,
                    'product2': 12,
                    'product3': 14,
                    'product4': 17
                }
            },
            {
                'average': (15+12+14)/3,
                'products': {
                    'product1': 15,
                    'product2': 12,
                    'product3': 14,
                }
            },
            {
                'average': (15+12+14+17+19)/5,
                'products': {
                    'product1': 15,
                    'product2': 12,
                    'product3': 14,
                    'product4': 17,
                    'product5': 19,
                }
            },
            {
                'average': 'expected_failure',
                'products': {
                    'product1': 15,
                    'product2': 12,
                    'product3': 14,
                    'product4': 'expected_failure'
                }
            },
        ]
        yield product_sets
        print("teardown")
    
    def test_average_product_price(self, setup_product_sets):
        customer = HighBudgetCustomer()
        
        product_sets = setup_product_sets
        
        for product_dict in product_sets:
            if not isinstance(product_dict.get('average'), float):
                with pytest.raises(TypeError) as e_info:
                    calculated_price = customer.calc_average_product_price(product_dict)
                    return

            calculated_price = customer.calc_average_product_price(product_dict)
            assert product_dict.get('average') == calculated_price
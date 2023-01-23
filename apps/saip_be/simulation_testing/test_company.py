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

import pytest
from saip_simulation.company import Company, Factory
from saip_simulation.config import FactoryPreset

class TestFactory():
    
    def test_ppu(self):
        fac = Factory()
        
        unitsA = int(FactoryPreset.STARTING_CAPACITY * 0.8)
        unitsB = int(FactoryPreset.STARTING_CAPACITY * 0.9)
        unitsC = int(FactoryPreset.STARTING_CAPACITY * 0.95)
        
        ppuA = fac.calculate_price_per_unit(unitsA)
        ppuB = fac.calculate_price_per_unit(unitsB)
        ppuC = fac.calculate_price_per_unit(unitsC)
        
        assert ppuA > ppuB
        assert ppuB < ppuC
        
        multiplier = FactoryPreset.OVER_THRESHOLD_MULTIPLIER**5
        assert ppuC == fac._price_per_unit(unitsC) * multiplier 


class TestCompany():
    pass
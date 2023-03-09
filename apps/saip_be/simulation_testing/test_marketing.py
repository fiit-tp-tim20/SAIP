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


import pytest
from saip_simulation.marketing import (
    SocialMedia,
    CableNews,
    Billboard,
    OOH,
    Podcast,
    MarketingError,
)
from saip_simulation.config import MarketingModifiers, MarketingInvestments


class TestMarketing:
    def test_min_investment(self):
        with pytest.raises(MarketingError):
            sm = SocialMedia(MarketingInvestments.SOCIAL_MEDIA_MIN - 1)

        with pytest.raises(MarketingError):
            cn = CableNews(MarketingInvestments.CABLE_NEWS_MIN - 1)

        with pytest.raises(MarketingError):
            bb = Billboard(MarketingInvestments.BILLBOARD_MIN - 1)

        with pytest.raises(MarketingError):
            ooh = OOH(MarketingInvestments.OOH_MIN - 1)

        with pytest.raises(MarketingError):
            pd = Podcast(MarketingInvestments.PODCAST_MIN - 1)

    def test_max_investment(self):
        with pytest.raises(MarketingError):
            sm = SocialMedia(MarketingInvestments.SOCIAL_MEDIA_MAX + 1)

        with pytest.raises(MarketingError):
            cn = CableNews(MarketingInvestments.CABLE_NEWS_MAX + 1)

        with pytest.raises(MarketingError):
            bb = Billboard(MarketingInvestments.BILLBOARD_MAX + 1)

        with pytest.raises(MarketingError):
            ooh = OOH(MarketingInvestments.OOH_MAX + 1)

        with pytest.raises(MarketingError):
            pd = Podcast(MarketingInvestments.PODCAST_MAX + 1)

    def test_efficiency_calculation(self):
        sm = SocialMedia(MarketingInvestments.SOCIAL_MEDIA_MIN)
        assert sm._calculate_effectivity_over_minimum() == 0
        assert sm._calculate_effectivity() == 0.7
        assert sm.yield_value() > 0.7 * MarketingModifiers.SOCIAL_MEDIA_BASE

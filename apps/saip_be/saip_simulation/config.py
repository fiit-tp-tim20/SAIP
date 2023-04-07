TURN_LENGTH = 3  # turn_length is 1 quarter, so 3 months
YEAR_LENGTH = 12  # months


class MarketingModifiers:
    SOCIAL_MEDIA_BASE = 1.25
    SOCIAL_MEDIA_BONUS = 0.1
    PODCAST = 1.25
    OOH = 1.5
    BILLBOARD = 1
    CABLE_NEWS = 1


class MarketingInvestments:
    SOCIAL_MEDIA_MIN = 100
    SOCIAL_MEDIA_MAX = 10_001
    SOCIAL_MEDIA_STEP = 1000

    PODCAST_MIN = 1000
    PODCAST_MAX = 10_001

    OOH_MIN = 500
    OOH_MAX = 10_001

    BILLBOARD_MIN = 500
    BILLBOARD_MAX = 10_001

    CABLE_NEWS_MIN = 2000
    CABLE_NEWS_MAX = 10_001


class FactoryPreset:
    BASE_RENT = 2000
    BASE_ENERGY_COST = 1500

    STARTING_EMPLOYEES = 10
    BASE_SALARY = 1500

    STARTING_INVESTMENT = 50_000
    STARTING_CAPACITY = 100

    INVENTORY_CHARGE_PER_UNIT = 5

    OPTIMAL_THRESHOLD = 0.9
    OVER_THRESHOLD_MULTIPLIER = 1.015

    FACTORY_WRITEOFF_RATE = (
        0.05 * TURN_LENGTH / YEAR_LENGTH
    )  # yearly maintenance rate * months in turn / months in year

    BASE_MATERIAL_COST_PER_UNIT = 250
    BASE_INFLATION = 0.02 * TURN_LENGTH / YEAR_LENGTH


class MarketPreset:
    STARTING_CUSTOMER_COUNT = 100
    BASE_MARKETING_INVESTMENT = 10_000
    INTERESTED_IN_RND = 0.15
    INTERESTED_IN_MARKETING = 0.2
    INTERESTED_IN_PRICE = 0.4


class CompanyPreset:
    DEFAULT_INTEREST_RATE = 0.025
    DEFAULT_TAX_RATE = 0.21
    DEFAULT_BUDGET_PER_TURN = 10_000
    DEFAULT_LOAN_LIMIT = 20_000

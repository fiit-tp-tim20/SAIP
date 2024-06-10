from django.db import models
from django.contrib.auth.models import User
from saip_simulation.config import (
    FactoryPreset,
)

class GameParameters(models.Model):
    budget_cap = models.PositiveIntegerField(default=10000)
    depreciation = models.FloatField(default=0.0125)
    base_man_cost = models.PositiveIntegerField(default=250)
    base_capital = models.PositiveIntegerField(default=40000)
    number_of_low_price_bots = models.PositiveIntegerField(default=3)
    number_of_avg_price_bots = models.PositiveIntegerField(default=3)
    number_of_high_price_bots = models.PositiveIntegerField(default=3)
    end_turn_on_committed = models.BooleanField(default=True)

    class Meta:
        db_table = "GameParameters"
        verbose_name_plural = "Game Parameters"


class Game(models.Model):
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True, editable=False)
    name = models.CharField(max_length=100, null=True)
    admin = models.ForeignKey(User, models.PROTECT, null=True, limit_choices_to={'is_staff': True})
    turns = models.PositiveIntegerField(null=True, default=16)
    parameters = models.ForeignKey(GameParameters, models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Games"
        get_latest_by = "start"


class Turn(models.Model):
    number = models.PositiveIntegerField(null=True)
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True, editable=False)
    game = models.ForeignKey(Game, models.CASCADE, null=True)
    inventory_charge_per_unit = models.FloatField(null=False, default=FactoryPreset.INVENTORY_CHARGE_PER_UNIT)

    def __str__(self):
        if self.end:
            return f"{self.game} - {self.number} (Ended)"
        return f"{self.game} - {self.number}"

    class Meta:
        db_table = "Turns"
        get_latest_by = "start"


class Company(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(
        User, models.CASCADE, null=True, related_name="user_companies"
    )
    game = models.ForeignKey(
        Game, models.CASCADE, null=True, related_name="game_companies"
    )
    participants = models.CharField(max_length=1000, null=True)

    def __str__(self):
        return f"{self.game} - {self.name} ({self.user})"

    class Meta:
        db_table = "Companies"
        verbose_name_plural = "Companies"


class Production(models.Model):
    man_cost = models.FloatField(null=True, default=0)
    man_cost_all = models.FloatField(null=True, default=0)
    sell_price = models.FloatField(null=True, default=0)
    volume = models.PositiveIntegerField(null=True, default=0)

    class Meta:
        db_table = "Productions"


class Marketing(models.Model):
    viral = models.PositiveIntegerField(default=0)
    podcast = models.PositiveIntegerField(default=0)
    ooh = models.PositiveIntegerField(default=0)
    tv = models.PositiveIntegerField(default=0)
    billboard = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "Marketings"


class Upgrade(models.Model):
    cost = models.PositiveIntegerField(null=True)
    sales_effect = models.FloatField(null=True)
    man_cost_effect = models.FloatField(null=True)
    name = models.CharField(max_length=100, null=True)
    camera_pos = models.CharField(max_length=100, null=True)
    camera_rot = models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=1000, null=True)

    def __str__(self):
        return f"{self.name} - {self.cost}"

    class Meta:
        db_table = "Upgrades"


class CompaniesUpgrades(models.Model):
    STARTED = "s"
    NOT_STARTED = "ns"
    FINISHED = "f"

    CHOICES = (
        (STARTED, "started"),
        (NOT_STARTED, "not started"),
        (FINISHED, "finished"),
    )
    status = models.CharField(max_length=100, choices=CHOICES, default=NOT_STARTED)
    company = models.ForeignKey(Company, models.CASCADE, null=True)
    upgrade = models.ForeignKey(Upgrade, models.CASCADE, null=True)
    progress = models.PositiveIntegerField(null=True, default=0)
    game = models.ForeignKey(Game, models.CASCADE, null=True)
    turn = models.ForeignKey(Turn, models.CASCADE, null=True)

    def __str__(self):
        return f"{self.company} - {self.upgrade}"

    class Meta:
        db_table = "Companies_Upgrades"
        verbose_name_plural = "Companies Upgrades"


class Factory(models.Model):
    capacity = models.PositiveIntegerField(null=True, default=100)
    base_cost = models.FloatField(null=True, default=0)
    capital = models.FloatField(null=True, default=0)
    capital_investments = models.FloatField(null=True, default=50000)

    class Meta:
        db_table = "Factories"
        verbose_name_plural = "Factories"


class CompaniesState(models.Model):
    company = models.ForeignKey(Company, models.CASCADE, null=True)
    turn = models.ForeignKey(Turn, models.CASCADE, null=True)
    production = models.OneToOneField(
        Production, models.SET_NULL, null=True, blank=True
    )
    factory = models.OneToOneField(Factory, models.SET_NULL, null=True, blank=True)
    stock_price = models.FloatField(null=True, blank=True)
    inventory = models.PositiveIntegerField(null=True, default=0)
    r_d = models.PositiveBigIntegerField(null=True, default=0)
    marketing = models.OneToOneField(Marketing, models.SET_NULL, null=True, blank=True)
    committed = models.BooleanField(default=False)

    # kontrola
    orders_received = models.PositiveIntegerField(null=True, default=0)
    orders_fulfilled = models.PositiveIntegerField(null=True, default=0)
    cash = models.FloatField(
        null=True, default=10000
    )  # celkovo dostupných prostriedkov
    bonus_spendable_cash = models.FloatField(null=True, default=0)
    ret_earnings = models.FloatField(null=True, default=0)
    net_profit = models.FloatField(null=True, blank=True)  # za kolo
    depreciation = models.FloatField(null=True, blank=True)
    new_loans = models.FloatField(null=True, blank=True)
    inventory_charge = models.FloatField(null=True, blank=True)
    sales = models.FloatField(null=True, blank=True)
    manufactured_man_cost = models.FloatField(null=True, blank=True)
    tax = models.FloatField(null=True, blank=True)
    profit_before_tax = models.FloatField(null=True, blank=True)
    interest = models.FloatField(null=True, blank=True)
    cash_flow_res = models.FloatField(null=True, blank=True)
    loan_repayment = models.FloatField(null=True, blank=True)
    loans = models.FloatField(null=True, default=20000)
    inventory_upgrade = models.FloatField(null=True, default=0)
    overcharge_upgrade = models.FloatField(null=True, default=0)
    sold_man_cost = models.FloatField(null=True, default=0)  # vyrobne naklady na predane vyrobky
    inventory_money = models.FloatField(null=True, default=0)  # Zásoby

    def __str__(self):
        return f"{self.company} - {self.turn}"

    class Meta:
        db_table = "Companies States"
        verbose_name_plural = "Companies States"


class CompaniesCommit(CompaniesState):
    class Meta:
        proxy = True
        verbose_name_plural = "Companies Commits"

class MarketState(models.Model):
    turn = models.ForeignKey(Turn, models.CASCADE, null=True)
    sold = models.PositiveIntegerField(null=True, default=0)
    demand = models.PositiveIntegerField(null=True, default=0)
    inventory = models.PositiveIntegerField(null=True, default=0)
    manufactured = models.PositiveIntegerField(null=True, default=0)
    capacity = models.PositiveIntegerField(null=True, default=0)

    def __str__(self):
        return f"Market State - {self.turn}"

    class Meta:
        db_table = "Market States"


class Inventory(models.Model):
    company = models.ForeignKey(Company, models.CASCADE, null=True)
    unit_count = models.PositiveIntegerField(null=True)
    price_per_unit = models.FloatField(null=True)
    turn_num = models.PositiveIntegerField(null=True)

    def __str__(self):
        return f"Inventories - {self.company}"

    class Meta:
        db_table = "Inventories"
        verbose_name_plural = "Inventories"


class TeacherDecisions(models.Model):
    turn = models.ForeignKey(Turn, models.CASCADE, null=True)
    interest_rate = models.FloatField(null=True, default=0.05)
    tax_rate = models.FloatField(null=True, default=0.21)
    inflation = models.FloatField(null=True, default=0)
    loan_limit = models.FloatField(null=True, default=200000)
    bonus_spendable_cash_increase_rate = models.FloatField(null=True, default=0.001)

    def __str__(self):
        return f"Teacher Decisions - {self.turn}"

    class Meta:
        db_table = "Teacher Decisions"
        verbose_name_plural = "Teacher Decisions"


class Bots(models.Model):
    game = models.ForeignKey(Game, models.CASCADE, null=True)
    token = models.CharField(max_length=64, null=True)
    type = models.CharField(max_length=1, default="L")

    def __str__(self):
        return f"{self.game} - {self.token}"

    class Meta:
        db_table = "Bots"

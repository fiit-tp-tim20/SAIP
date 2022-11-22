from django.db import models
from django.contrib.auth.models import User


class GameParameters(models.Model):
    budget_cap = models.PositiveIntegerField(null=True)
    depreciation = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'GameParameters'


class Game(models.Model):
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)
    name = models.CharField(max_length=100, null=True)
    admin = models.ForeignKey(User, models.DO_NOTHING, null=True)
    turns = models.PositiveIntegerField(null=True)
    parameters = models.ForeignKey(GameParameters, models.DO_NOTHING, null=True)

    class Meta:
        db_table = 'Games'
        get_latest_by = 'start'


class Turn(models.Model):
    number = models.PositiveIntegerField(null=True)
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'Turns'
        get_latest_by = 'start'


class Company(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, models.DO_NOTHING, null=True, related_name='user_companies')

    class Meta:
        db_table = 'Companies'
        verbose_name_plural = 'Companies'


class Production(models.Model):
    man_cost = models.FloatField(null=True)
    sell_price = models.FloatField(null=True)
    volume = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'Productions'


class Spending(models.Model):
    r_d = models.FloatField(null=True)
    marketing = models.FloatField(null=True)
    factory = models.FloatField(null=True)
    run_cost = models.FloatField(null=True)

    class Meta:
        db_table = 'Spendings'


class Upgrade(models.Model):
    cost = models.PositiveIntegerField(null=True)
    effect = models.FloatField(null=True)
    name = models.CharField(max_length=100, null=True)
    camera_pos = models.CharField(max_length=100, null=True)
    camera_rot = models.CharField(max_length=100, null=True)
    
    class Meta:
        db_table = 'Upgrades'


class CompaniesUpgrades(models.Model):
    STARTED = 's'
    NOT_STARTED = 'ns'
    FINISHED = 'f'

    CHOICES = (
        (STARTED, 'started'),
        (NOT_STARTED, 'not started'),
        (FINISHED, 'finished'),
    )
    status = models.CharField(max_length=100, choices=CHOICES, default=NOT_STARTED)
    company = models.ForeignKey(Company, models.DO_NOTHING, null=True)
    upgrade = models.ForeignKey(Upgrade, models.DO_NOTHING, null=True)
    progress = models.PositiveIntegerField(null=True, default=0)
    game = models.ForeignKey(Game, models.DO_NOTHING, null=True)

    class Meta:
        db_table = 'Companies_Upgrades'
        verbose_name_plural = 'CompaniesUpgrades'


class Factory(models.Model):
    employees = models.PositiveIntegerField(null=True)
    capacity = models.PositiveIntegerField(null=True)
    base_cost = models.FloatField(null=True)

    class Meta:
        db_table = 'Factories'
        verbose_name_plural = 'Factories'


class CompaniesState(models.Model):
    company = models.ForeignKey(Company, models.DO_NOTHING, null=True)
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    production = models.OneToOneField(Production, models.DO_NOTHING, null=True)
    spending = models.OneToOneField(Spending, models.DO_NOTHING, null=True)
    factory = models.OneToOneField(Factory, models.DO_NOTHING, null=True)
    fan_base = models.PositiveIntegerField(null=True, blank=True)
    balance = models.FloatField(null=True, blank=True)
    stock_price = models.FloatField(null=True, blank=True)
    inventory = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'CompaniesStates'


class MarketState(models.Model):
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    size = models.PositiveIntegerField(null=True)
    demand = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'MarketStates'


class Parameter(models.Model):
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    market_size_diff = models.IntegerField(null=True)
    run_cost_multiplier = models.FloatField(null=True)

    class Meta:
        db_table = 'Parameters'


class EmailGroup(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING, null=True)
    email = models.EmailField(null=True)

    class Meta:
        db_table = 'Emails'

from django.db import models
from django.contrib.auth.models import User


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


class Product(models.Model):
    upgrades = models.IntegerField(null=True)

    class Meta:
        db_table = 'Products'


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
    product = models.OneToOneField(Product, models.DO_NOTHING, null=True)
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

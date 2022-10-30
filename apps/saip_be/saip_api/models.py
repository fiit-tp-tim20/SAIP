from django.db import models
from django.contrib.auth.models import User


class Turns(models.Model):
    number = models.PositiveIntegerField(null=True)
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'Turns'
        get_latest_by = 'start'


class Companies(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, models.DO_NOTHING, null=True, related_name='user_companies')

    class Meta:
        db_table = 'Companies'


class Productions(models.Model):
    man_cost = models.FloatField(null=True)
    sell_price = models.FloatField(null=True)
    volume = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'Productions'


class Spendings(models.Model):
    r_d = models.FloatField(null=True)
    marketing = models.FloatField(null=True)
    factory = models.FloatField(null=True)
    run_cost = models.FloatField(null=True)

    class Meta:
        db_table = 'Spendings'


class Products(models.Model):
    upgrades = models.IntegerField(null=True)

    class Meta:
        db_table = 'Products'


class Factories(models.Model):
    employees = models.PositiveIntegerField(null=True)
    capacity = models.PositiveIntegerField(null=True)
    base_cost = models.FloatField(null=True)

    class Meta:
        db_table = 'Factories'


class CompaniesStates(models.Model):
    company = models.ForeignKey(Companies, models.DO_NOTHING, null=True)
    turn = models.ForeignKey(Turns, models.DO_NOTHING, null=True)
    production = models.OneToOneField(Productions, models.DO_NOTHING, null=True)
    spending = models.OneToOneField(Spendings, models.DO_NOTHING, null=True)
    product = models.OneToOneField(Products, models.DO_NOTHING, null=True)
    factory = models.OneToOneField(Factories, models.DO_NOTHING, null=True)
    fan_base = models.PositiveIntegerField(null=True, blank=True)
    balance = models.FloatField(null=True, blank=True)
    stock_price = models.FloatField(null=True, blank=True)
    inventory = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'CompaniesStates'


class MarketStates(models.Model):
    turn = models.ForeignKey(Turns, models.DO_NOTHING, null=True)
    size = models.PositiveIntegerField(null=True)
    demand = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'MarketStates'


class Parameters(models.Model):
    turn = models.ForeignKey(Turns, models.DO_NOTHING, null=True)
    market_size_diff = models.IntegerField(null=True)
    run_cost_multiplier = models.FloatField(null=True)

    class Meta:
        db_table = 'Parameters'


class Emails(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING, null=True)
    email = models.EmailField(null=True)

    class Meta:
        db_table = 'Emails'

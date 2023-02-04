from django.db import models
from django.contrib.auth.models import User


class GameParameters(models.Model):
    budget_cap = models.PositiveIntegerField(default=10000)
    depreciation = models.FloatField(default=0.1)

    class Meta:
        db_table = 'GameParameters'
        verbose_name_plural = 'GameParameters'


class Game(models.Model):
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)
    name = models.CharField(max_length=100, null=True)
    admin = models.ForeignKey(User, models.DO_NOTHING, null=True)
    turns = models.PositiveIntegerField(null=True)
    parameters = models.ForeignKey(GameParameters, models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'Games'
        get_latest_by = 'start'


class Turn(models.Model):
    number = models.PositiveIntegerField(null=True)
    start = models.DateTimeField(null=True, auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)
    game = models.ForeignKey(Game, models.DO_NOTHING, null=True)

    def __str__(self):
        return f"{self.game.__str__()} - {self.number}"

    class Meta:
        db_table = 'Turns'
        get_latest_by = 'start'


class Company(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, models.DO_NOTHING, null=True, related_name='user_companies')
    game = models.ForeignKey(Game, models.DO_NOTHING, null=True, related_name='game_companies')

    def __str__(self):
        return f"{self.game.__str__()} - {self.name} ({self.user.__str__()})"

    class Meta:
        db_table = 'Companies'
        verbose_name_plural = 'Companies'


class Production(models.Model):
    man_cost = models.FloatField(null=True)
    sell_price = models.FloatField(null=True)
    volume = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'Productions'


class Marketing(models.Model):
    viral = models.PositiveIntegerField(default=0)
    podcast = models.PositiveIntegerField(default=0)
    ooh = models.PositiveIntegerField(default=0)
    tv = models.PositiveIntegerField(default=0)
    billboard = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'Marketings'


class Upgrade(models.Model):
    cost = models.PositiveIntegerField(null=True)
    effect = models.FloatField(null=True)
    name = models.CharField(max_length=100, null=True)
    camera_pos = models.CharField(max_length=100, null=True)
    camera_rot = models.CharField(max_length=100, null=True)
    game = models.ForeignKey(Game, models.DO_NOTHING, null=True, related_name='game_upgrades')

    def __str__(self):
        return f"{self.game.__str__()} - {self.name}"

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

    def __str__(self):
        return f"{self.company.__str__()} - {self.upgrade.__str__()}"

    class Meta:
        db_table = 'Companies_Upgrades'
        verbose_name_plural = 'CompaniesUpgrades'


class Factory(models.Model):
    prod_emp = models.PositiveIntegerField(null=True)
    cont_emp = models.PositiveIntegerField(null=True)
    aux_emp = models.PositiveIntegerField(null=True)
    capacity = models.PositiveIntegerField(null=True)
    base_cost = models.PositiveIntegerField(null=True)
    capital = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'Factories'
        verbose_name_plural = 'Factories'


class CompaniesState(models.Model):
    company = models.ForeignKey(Company, models.DO_NOTHING, null=True)
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    production = models.OneToOneField(Production, models.DO_NOTHING, null=True)
    factory = models.OneToOneField(Factory, models.DO_NOTHING, null=True)
    balance = models.FloatField(null=True, blank=True)
    stock_price = models.FloatField(null=True, blank=True)
    inventory = models.PositiveIntegerField(null=True, blank=True)
    r_d = models.PositiveBigIntegerField(null=True, blank=True)
    marketing = models.OneToOneField(Marketing, models.DO_NOTHING, null=True)

    def __str__(self):
        return f"{self.company.__str__()} - {self.turn.__str__()}"

    class Meta:
        db_table = 'CompaniesStates'


class MarketState(models.Model):
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    size = models.PositiveIntegerField(null=True)
    demand = models.PositiveIntegerField(null=True)

    def __str__(self):
        return f"Market State - {self.turn.__str__()}"

    class Meta:
        db_table = 'MarketStates'


class Parameter(models.Model):
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    market_size_diff = models.IntegerField(default=0)
    run_cost_multiplier = models.FloatField(default=1)

    class Meta:
        db_table = 'Parameters'


class EmailGroup(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING, null=True)
    email = models.EmailField(null=True)

    def __str__(self):
        return f"{self.email}({self.user.__str__()})"

    class Meta:
        db_table = 'Emails'

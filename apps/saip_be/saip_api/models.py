from django.db import models
from django.contrib.auth.models import User


class GameParameters(models.Model):
    budget_cap = models.PositiveIntegerField(default=10000)
    depreciation = models.FloatField(default=0.1)
    base_man_cost = models.PositiveIntegerField(default=50)
    base_capital = models.PositiveIntegerField(default=10000)
    end_turn_on_committed = models.BooleanField(default=True)

    class Meta:
        db_table = 'GameParameters'
        verbose_name_plural = 'Game Parameters'


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
        if self.end:
            return f"{self.game} - {self.number} (Ended)"
        return f"{self.game} - {self.number}"

    class Meta:
        db_table = 'Turns'
        get_latest_by = 'start'


class Company(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, models.DO_NOTHING, null=True, related_name='user_companies')
    game = models.ForeignKey(Game, models.DO_NOTHING, null=True, related_name='game_companies')

    def __str__(self):
        return f"{self.game} - {self.name} ({self.user})"

    class Meta:
        db_table = 'Companies'
        verbose_name_plural = 'Companies'


class Production(models.Model):
    man_cost = models.FloatField(null=True, default=0)
    man_cost_all = models.FloatField(null=True, default=0)
    sell_price = models.FloatField(null=True, default=0)
    volume = models.PositiveIntegerField(null=True, default=0)

    class Meta:
        db_table = 'Productions'


class Marketing(models.Model):
    viral = models.PositiveIntegerField(default=0)
    podcast = models.PositiveIntegerField(default=0)
    ooh = models.PositiveIntegerField(default=0)
    tv = models.PositiveIntegerField(default=0)
    billboard = models.PositiveIntegerField(default=0)

    # def __str__(self):
    #     return f"Marketing - {self.companiesstate.company}"

    class Meta:
        db_table = 'Marketings'


class Upgrade(models.Model):
    cost = models.PositiveIntegerField(null=True)
    sales_effect = models.FloatField(null=True)
    man_cost_effect = models.FloatField(null=True)
    name = models.CharField(max_length=100, null=True)
    camera_pos = models.CharField(max_length=100, null=True)
    camera_rot = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f"{self.name} - {self.cost}"

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
    company = models.ForeignKey(Company, models.CASCADE, null=True)
    upgrade = models.ForeignKey(Upgrade, models.CASCADE, null=True)
    progress = models.PositiveIntegerField(null=True, default=0)
    game = models.ForeignKey(Game, models.CASCADE, null=True)
    turn = models.ForeignKey(Turn, models.PROTECT, null=True)

    def __str__(self):
        return f"{self.company} - {self.upgrade}"

    class Meta:
        db_table = 'Companies_Upgrades'
        verbose_name_plural = 'Companies Upgrades'


class Factory(models.Model):
    # prod_emp = models.PositiveIntegerField(null=True, default=0)
    # cont_emp = models.PositiveIntegerField(null=True, default=0)
    # aux_emp = models.PositiveIntegerField(null=True, default=0)
    capacity = models.PositiveIntegerField(null=True, default=100)
    base_cost = models.FloatField(null=True,default=0)
    capital = models.FloatField(null=True,default=0)
    capital_investments = models.FloatField(null=True, default=10000)

    # def __str__(self):
    #     return f"Factory - {self.companiesstate.company}"

    class Meta:
        db_table = 'Factories'
        verbose_name_plural = 'Factories'


class CompaniesState(models.Model):
    company = models.ForeignKey(Company, models.PROTECT, null=True)
    turn = models.ForeignKey(Turn, models.PROTECT, null=True)
    production = models.OneToOneField(Production, models.SET_NULL, null=True, blank=True)
    factory = models.OneToOneField(Factory, models.SET_NULL, null=True, blank=True)
    balance = models.FloatField(null=True, blank=True)
    stock_price = models.FloatField(null=True, blank=True)
    inventory = models.PositiveIntegerField(null=True, default=0)
    r_d = models.PositiveBigIntegerField(null=True, default=0)
    marketing = models.OneToOneField(Marketing, models.SET_NULL, null=True, blank=True)
    committed = models.BooleanField(default=False)

    #kontrola
    orders_received = models.PositiveIntegerField(null=True, default=0)
    orders_fulfilled = models.PositiveIntegerField(null=True, default=0)
    cash = models.FloatField(null=True, default=15000) #celkovo dostupných prostriedkov
    #capital = models.FloatField(null=True, default=0)
    ret_earnings = models.FloatField(null=True, blank=True) 
    net_profit = models.FloatField(null=True, blank=True) #za kolo
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
    loans = models.FloatField(null=True, default=0)

    def __str__(self):
        return f"{self.company} - {self.turn}"

    class Meta:
        db_table = 'Companies States'
        verbose_name_plural = 'Companies States'


class MarketState(models.Model):
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    sold = models.PositiveIntegerField(null=True, blank=True)
    demand = models.PositiveIntegerField(null=True, blank=True)
    inventory = models.PositiveIntegerField(null=True, blank=True)
    manufactured = models.PositiveIntegerField(null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"Market State - {self.turn}"

    class Meta:
        db_table = 'Market States'

class TeacherDecisions(models.Model):
    turn = models.ForeignKey(Turn, models.DO_NOTHING, null=True)
    interest_rate = models.FloatField(null=True, default=0.05)
    tax_rate = models.FloatField(null=True, default=0.2)
    inflation = models.FloatField(null=True, default=0)
    loan_limit = models.FloatField(null=True, default=20000)

    class Meta:
        db_table = 'Teacher Decisions'
        verbose_name_plural = 'Teacher Decisions'

class EmailGroup(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING, null=True)
    email = models.EmailField(null=True)

    def __str__(self):
        return f"{self.email}({self.user})"

    class Meta:
        db_table = 'Emails'

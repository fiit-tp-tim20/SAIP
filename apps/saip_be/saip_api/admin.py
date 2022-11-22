from django.contrib import admin
from .models import Turn, Company, Production, Spending, Factory, CompaniesState, Game, GameParameters, MarketState,\
    Parameter, EmailGroup, Upgrade, CompaniesUpgrades


@admin.register(Turn)
class TurnsAdmin(admin.ModelAdmin):
    list_display = ('number', 'start', 'end')


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')


@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):
    list_display = ('man_cost', 'sell_price', 'volume')


@admin.register(Spending)
class SpendingAdmin(admin.ModelAdmin):
    list_display = ('r_d', 'marketing', 'factory', 'run_cost')


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    list_display = ('employees', 'capacity', 'base_cost')


@admin.register(CompaniesState)
class CompaniesStateAdmin(admin.ModelAdmin):
    list_display = ('company', 'turn', 'production', 'spending', 'factory', 'fan_base', 'balance', 'stock_price',)


@admin.register(MarketState)
class MarketStateAdmin(admin.ModelAdmin):
    list_display = ('turn', 'size', 'demand')


@admin.register(Parameter)
class ParameterAdmin(admin.ModelAdmin):
    list_display = ('turn', 'market_size_diff', 'run_cost_multiplier')


@admin.register(EmailGroup)
class EmailGroupAdmin(admin.ModelAdmin):
    list_display = ('user', 'email')


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'admin', 'start', 'end', 'turns')


@admin.register(GameParameters)
class GameParametersAdmin(admin.ModelAdmin):
    list_display = ('budget_cap', 'depreciation')


@admin.register(Upgrade)
class UpgradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'camera_pos', 'camera_rot')


@admin.register(CompaniesUpgrades)
class CompaniesUpgradeAdmin(admin.ModelAdmin):
    list_display = ('company', 'upgrade', 'status', 'progress')

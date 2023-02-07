from django.contrib import admin
from .models import Turn, Company, Production, Marketing, Factory, CompaniesState, Game, GameParameters, MarketState,\
    EmailGroup, Upgrade, CompaniesUpgrades


@admin.register(Turn)
class TurnsAdmin(admin.ModelAdmin):
    list_display = ('number', 'game', 'start', 'end')
    list_filter = ('game',)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'game', 'user')
    list_filter = ('game',)


@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):
    list_display = ('man_cost', 'sell_price', 'volume')


@admin.register(Marketing)
class SpendingAdmin(admin.ModelAdmin):
    list_display = ('viral', 'podcast', 'ooh', 'tv', 'billboard')


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    list_display = ('prod_emp', 'cont_emp', 'aux_emp', 'capacity', 'base_cost', 'capital')


@admin.register(CompaniesState)
class CompaniesStateAdmin(admin.ModelAdmin):
    list_display = ('company', 'turn', 'production', 'marketing', 'factory', 'balance', 'stock_price', 'r_d',
                    'inventory')
    list_filter = ('turn', 'company__game')


@admin.register(MarketState)
class MarketStateAdmin(admin.ModelAdmin):
    list_display = ('turn', 'size', 'demand')



@admin.register(EmailGroup)
class EmailGroupAdmin(admin.ModelAdmin):
    list_display = ('user', 'email')


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'admin', 'start', 'end', 'turns')
    list_filter = ('admin',)


@admin.register(GameParameters)
class GameParametersAdmin(admin.ModelAdmin):
    list_display = ('budget_cap', 'depreciation', 'base_man_cost')


@admin.register(Upgrade)
class UpgradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'man_cost_effect', 'sales_effect', 'camera_pos', 'camera_rot')


@admin.register(CompaniesUpgrades)
class CompaniesUpgradeAdmin(admin.ModelAdmin):
    list_display = ('company', 'game', 'upgrade', 'status', 'progress')
    list_filter = ('company__game', 'company', 'upgrade')

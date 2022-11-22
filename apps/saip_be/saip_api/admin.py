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
    pass


@admin.register(Spending)
class SpendingAdmin(admin.ModelAdmin):
    pass


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    pass


@admin.register(CompaniesState)
class CompaniesStateAdmin(admin.ModelAdmin):
    pass


@admin.register(MarketState)
class MarketStateAdmin(admin.ModelAdmin):
    pass


@admin.register(Parameter)
class ParameterAdmin(admin.ModelAdmin):
    pass


@admin.register(EmailGroup)
class EmailGroupAdmin(admin.ModelAdmin):
    list_display = ('user', 'email')


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass


@admin.register(GameParameters)
class GameParametersAdmin(admin.ModelAdmin):
    pass


@admin.register(Upgrade)
class UpgradeAdmin(admin.ModelAdmin):
    pass


@admin.register(CompaniesUpgrades)
class CompaniesUpgradeAdmin(admin.ModelAdmin):
    pass

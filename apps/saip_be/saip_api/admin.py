from django.contrib import admin
from .models import Turn, Company, Production, Spending, Product, Factory, CompaniesState, MarketState, Parameter,\
    EmailGroup


@admin.register(Turn)
class TurnsAdmin(admin.ModelAdmin):
    pass


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')


@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):
    pass


@admin.register(Spending)
class SpendingAdmin(admin.ModelAdmin):
    pass


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
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


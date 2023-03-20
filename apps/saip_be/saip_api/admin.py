from django.contrib import admin
from .models import Turn, Company, Production, Marketing, Factory, CompaniesState, Game, GameParameters, MarketState,\
    EmailGroup, Upgrade, CompaniesUpgrades

from django_object_actions import DjangoObjectActions, action

from .views.GameManagement import end_turn, get_last_turn

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
    list_display = ('man_cost', 'sell_price', 'volume', 'companiesstate')
    list_filter = ('companiesstate__company__game',)


@admin.register(Marketing)
class SpendingAdmin(admin.ModelAdmin):
    list_display = ('viral', 'podcast', 'ooh', 'tv', 'billboard', 'companiesstate')
    list_filter = ('companiesstate__company__game',)


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    list_display = ('capacity', 'base_cost', 'capital', 'capital_investments', 'companiesstate')
    list_filter = ('companiesstate__company__game',)


@admin.register(CompaniesState)
class CompaniesStateAdmin(admin.ModelAdmin):
    list_display = ('company', 'turn', 'production', 'marketing', 'factory', 'balance', 'stock_price', 'r_d',
                    'inventory')
    list_filter = ('turn', 'company__game')


@admin.register(MarketState)
class MarketStateAdmin(admin.ModelAdmin):
    list_display = ('turn', 'sold', 'demand', 'inventory', 'manufactured', 'capacity', 'interest_rate', 'tax_rate', 'inflation', 'loan_limit')



@admin.register(EmailGroup)
class EmailGroupAdmin(admin.ModelAdmin):
    list_display = ('user', 'email')


@admin.register(Game)
class GameAdmin(DjangoObjectActions, admin.ModelAdmin):
    @action(label='End Turn', description='Ends the turn if you are admin for this game')
    def EndTurn(modeladmin, request, queryset):
        if request.user != queryset.admin or queryset.end is not None:
            # print("You are not the admin of this game")
            return

        last_turn = get_last_turn(queryset)
        if not last_turn or last_turn.end is not None:
            return
        _ = end_turn(last_turn)

    change_actions = ('EndTurn',)
    list_display = ('name', 'admin', 'start', 'end', 'turns')
    list_filter = ('admin',)


@admin.register(GameParameters)
class GameParametersAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'budget_cap', 'depreciation', 'base_man_cost')


@admin.register(Upgrade)
class UpgradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'man_cost_effect', 'sales_effect', 'camera_pos', 'camera_rot')


@admin.register(CompaniesUpgrades)
class CompaniesUpgradeAdmin(admin.ModelAdmin):
    list_display = ('company', 'game', 'upgrade', 'status', 'progress', 'turn')
    list_filter = ('company__game', 'company', 'upgrade', 'turn')

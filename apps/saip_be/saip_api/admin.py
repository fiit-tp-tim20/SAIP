from django.contrib import admin
from django.http import HttpResponse

from .Exports import create_game_export

from .models import Turn, Company, Production, Marketing, Factory, CompaniesState, Game, GameParameters, MarketState,\
    Upgrade, CompaniesUpgrades, TeacherDecisions

from django_object_actions import DjangoObjectActions, action

from .views.GameManagement import end_turn, get_last_turn, create_default_upgrades, create_turn

@admin.register(Turn)
class TurnsAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'number', 'game', 'start', 'end')
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
                    'inventory', 'manufactured_man_cost')
    list_filter = ('turn', 'company__game')


@admin.register(MarketState)
class MarketStateAdmin(admin.ModelAdmin):
    list_display = ('turn', 'sold', 'demand', 'inventory', 'manufactured', 'capacity')

@admin.register(TeacherDecisions)
class TeacherDecisions(admin.ModelAdmin):
    list_display = ('__str__', 'interest_rate', 'tax_rate', 'inflation', 'loan_limit')
    list_filter = ('turn__game', 'turn__game__admin')


# @admin.register(EmailGroup)
# class EmailGroupAdmin(admin.ModelAdmin):
#     list_display = ('user', 'email')


@admin.register(Game)
class GameAdmin(DjangoObjectActions, admin.ModelAdmin):
    @action(label='End Turn', description='Ends the turn if you are admin for this game')
    def EndTurn(modeladmin, request, queryset):
        if request.user != queryset.admin or queryset.end is not None:
            return HttpResponse("You are not the admin of this game", status=403)

        last_turn = get_last_turn(queryset)
        if not last_turn:
            return HttpResponse("Last turn not found", status=404)
        if last_turn.end is not None:
            return HttpResponse("Last turn is already ended", status=500)
        _ = end_turn(last_turn)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        create_default_upgrades() # checks if upgrades exist and creates them if not
        if not get_last_turn(obj): # verify that there is no turn for this game (it was just created)
            create_turn(0, obj)

    @action(label='Download export', description='Download export for this game')
    def Download(modeladmin, request, queryset):
        if request.user != queryset.admin:
            return HttpResponse("You are not the admin of this game", status=403)

        f = create_game_export(queryset)

        response = HttpResponse(f.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{queryset.name}.zip"'
        return response

    change_actions = ('EndTurn', 'Download')
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

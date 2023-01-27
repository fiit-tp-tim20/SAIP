from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn

from ..serializers import CompanySerializer, ProductionSerializer, SpendingsSerializer, MaketingSerializer, FactorySerializer

from .GameManagement import get_last_turn

from django.core import serializers

def create_upgrade_company_relation(game: Game, company: Company) -> None:
    for upgrade in Upgrade.objects.filter(game=game):
        CompaniesUpgrades.objects.create(upgrade=upgrade, company=company, game=game)


class CreateCompanyView(APIView):

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company = serializer.save()

        company.user = request.user
        company.save()

        create_upgrade_company_relation(company.game, company)

        return Response({"companyID": company.id}, status=201)


# {"marketing": {
#     "viral": 1000,
#     "podcast": 0,
#     "ooh": 12,
#     "tv": 0,
#     "billboard": 69
#     },
# "production": {
#     "man_cost": 100,
#     "sell_price": 152,
#     "volume": 99901
#     },
# "factory": {
#     "prod_emp": 100,
#     "cont_emp": 12,
#     "aux_emp": 5,
#     "capital": 10000
#     },
# "r_d": 2500
# }

class PostSpendingsView(APIView):

    def post(self, request) -> Response:
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        try:
            company = Company.objects.get(user=request.user)
        except Company.DoesNotExist:
            return Response({"detail": "Company for this user not found"}, status=404)

        last_turn = get_last_turn(company.game)
        try:
            company_state = CompaniesState.objects.get(turn=last_turn, company=company)
        except CompaniesState.DoesNotExist:
            return Response({"detail": "Company state for this turn does not exist"}, status=500)

        spendings_serializer = SpendingsSerializer(data=request.data)
        spendings_serializer.is_valid(raise_exception=True)

        if company_state.production:
            company_state.production.delete()

        prod_serializer = ProductionSerializer(data=request.data['production'])
        prod_serializer.is_valid(raise_exception=True)

        production = prod_serializer.save()

        company_state.production = production


        if company_state.factory:
            company_state.factory.delete()

        factory_serializer = FactorySerializer(data=request.data['factory'])
        factory_serializer.is_valid(raise_exception=True)

        factory = factory_serializer.save()

        company_state.factory = factory


        if company_state.marketing:
            company_state.marketing.delete()

        marketing_serializer = MaketingSerializer(data=request.data['marketing'])
        marketing_serializer.is_valid(raise_exception=True)

        marketing = marketing_serializer.save()

        company_state.marketing = marketing


        company_state.save()


        brakes = request.data['brakes']
        frame = request.data['frame']
        battery = request.data['battery']

        brakes_cost = Upgrade.objects.get(name="Brakes").cost
        frame_cost = Upgrade.objects.get(name="Frame").cost
        battery_cost = Upgrade.objects.get(name="Battery").cost
        print(brakes_cost)


        return Response({"company": company.name, 'request': request.data,
                         'cs': serializers.serialize('json', [company_state, ])}, status=201)


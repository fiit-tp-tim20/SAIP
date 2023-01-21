from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn

from ..serializers import CompanySerializer, ProductionSerializer

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

        if company_state.production:
            company_state.production.delete()

        prod_serializer = ProductionSerializer(data=request.data['Production'])
        prod_serializer.is_valid(raise_exception=True)

        production = prod_serializer.save()

        company_state.production = production
        company_state.save()

        return Response({"company": company.name, 'request': request.data,
                         'cs': serializers.serialize('json', [company_state, ])}, status=201)


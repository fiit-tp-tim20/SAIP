from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade

from ..serializers import CompanySerializer


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

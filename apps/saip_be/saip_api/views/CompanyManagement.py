from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Game, Company, CompaniesUpgrades, Upgrade, CompaniesState, Turn, CompaniesUpgrades

from ..serializers import CompanySerializer, ProductionSerializer, SpendingsSerializer, MaketingSerializer, FactorySerializer

from .GameManagement import get_last_turn

from django.core import serializers

def create_upgrade_company_relation(game: Game, company: Company) -> None:
    for upgrade in Upgrade.objects.all():
        CompaniesUpgrades.objects.create(upgrade=upgrade, company=company, game=game)

class CompanyInfo(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        company = Company.objects.get(user=request.user)
        response = {'company': list()}

        response['company'].append({
            'id': company.id,
            'name': company.name,
            'budget_cap': company.game.parameters.budget_cap,
        })

        return Response(response)

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

        if company_state.commited:
            return Response({"detail": "Decisions were posted before"}, status=409)

        spendings_serializer = SpendingsSerializer(data=request.data)
        spendings_serializer.is_valid(raise_exception=True)

        prod_serializer = ProductionSerializer(company_state.production, data=request.data['production'])
        prod_serializer.is_valid(raise_exception=True)


        factory_serializer = FactorySerializer(company_state.factory, data=request.data['factory'])
        factory_serializer.is_valid(raise_exception=True)


        marketing_serializer = MaketingSerializer(company_state.marketing, data=request.data['marketing'])
        marketing_serializer.is_valid(raise_exception=True)


        try:    brakes = request.data['brakes']
        except KeyError: brakes = 0
        try:    frame = request.data['frame']
        except KeyError: frame = 0
        try:    battery = request.data['battery']
        except KeyError: battery = 0
        try:    display = request.data['display']
        except KeyError: display = 0

        brakes_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Brakes"))
        if brakes > 0:
            if brakes_progress.status == "f":
                return Response({"detail": "Brakes are already finished"}, status=409)
            if brakes_progress.progress == 0:
                brakes_progress.status = "s"
            brakes_progress.progress = brakes_progress.progress + brakes
            if brakes_progress.progress >= Upgrade.objects.get(name="Brakes").cost:
                brakes_progress.status = "f"
            

        frame_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Frame"))
        if frame > 0:
            if frame_progress.status == "f":
                return Response({"detail": "Frame is already finished"}, status=409)
            if frame_progress.progress == 0:
                frame_progress.status = "s"
            frame_progress.progress = frame_progress.progress + frame
            if frame_progress.progress >= Upgrade.objects.get(name="Frame").cost:
                frame_progress.status = "f"
            

        battery_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Battery"))
        if battery > 0:
            if battery_progress.status == "f":
                return Response({"detail": "Battery is already finished"}, status=409)
            if battery_progress.progress == 0:
                battery_progress.status = "s"
            battery_progress.progress = battery_progress.progress + battery
            if battery_progress.progress >= Upgrade.objects.get(name="Battery").cost:
                battery_progress.status = "f"
            

        display_progress = CompaniesUpgrades.objects.get(company=company, upgrade = Upgrade.objects.get(name="Display"))
        if display > 0:
            if display_progress.status == "f":
                return Response({"detail": "Display is already finished"}, status=409)
            if display_progress.progress == 0:
                display_progress.status = "s"
            display_progress.progress = display_progress.progress + display
            if display_progress.progress >= Upgrade.objects.get(name="Display").cost:
                display_progress.status = "f"
            

        production = prod_serializer.save()
        company_state.production = production

        factory = factory_serializer.save()
        company_state.factory = factory

        marketing = marketing_serializer.save()
        company_state.marketing = marketing

        brakes_progress.save()
        frame_progress.save()
        battery_progress.save()
        display_progress.save()

        company_state.r_d = brakes + frame + battery + display
        company_state.commited = True
        company_state.save()

        return Response(status=201)


from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Company, Companies_Upgrades, Upgrade, Game


class UpgradeView(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        company = Company.objects.get(user=request.user)
        companies_upgrades = Companies_Upgrades.objects.filter(company=company)

        response = dict()
        response['upgrade'] = list()
        other_companies_list = []

        for upgrade in companies_upgrades:
            other_companies = Companies_Upgrades.objects.filter(upgrade=upgrade.upgrade, status="f", game=upgrade.game)
            for item in other_companies:
                other_companies_list.append(item.company.name)

            camera_pos = Upgrade.objects.get(pk=upgrade.id).camera_pos.split(",")
            camera_rot = Upgrade.objects.get(pk=upgrade.id).camera_rot.split(",")

            response['upgrade'].append({
                'name': Upgrade.objects.get(pk=upgrade.id).name,
                'players': other_companies_list,
                'status': upgrade.get_status_display(),
                'price': Upgrade.objects.get(pk=upgrade.id).cost,
                'progress': upgrade.progess,
                'camera_pos': camera_pos,
                'camera_rot': camera_rot,
            })

        return Response(response)

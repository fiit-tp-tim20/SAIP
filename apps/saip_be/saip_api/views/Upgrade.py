from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Company, CompaniesUpgrades, Upgrade, Game
from .GameManagement import get_last_turn


class UpgradeView(APIView):

    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        company = Company.objects.get(user=request.user)
        companies_upgrades = CompaniesUpgrades.objects.filter(company=company)
        last_turn = get_last_turn(company.game)

        response = {'upgrade': list()}

        for upgrade in companies_upgrades:
            other_companies = CompaniesUpgrades.objects.filter(upgrade=upgrade.upgrade, status="f",
                                                               game=upgrade.game).exclude(turn=last_turn)
            other_companies_list = [item.company.name for item in other_companies]

            local_upgrade = Upgrade.objects.get(pk=upgrade.upgrade_id)
            camera_pos = local_upgrade.camera_pos.split(",")
            camera_rot = local_upgrade.camera_rot.split(",")
            description = local_upgrade.description

            response['upgrade'].append({
                'name': local_upgrade.name,
                'players': other_companies_list,
                'status': upgrade.get_status_display(),
                'price': local_upgrade.cost,
                'progress': upgrade.progress,
                'camera_pos': camera_pos,
                'camera_rot': camera_rot,
                'description': description
            })

        return Response(response)

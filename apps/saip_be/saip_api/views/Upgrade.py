from rest_framework.views import APIView
from rest_framework.response import Response

from saip_api.models import Company, Companies_Upgrades, Upgrade, Game

class UpgradeView(APIView):
    
    def get(self, request) -> Response:

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)

        company = Company.objects.filter(user = request.user)
        game = Game.objects.filter(admin = request.user)
        companies_upgrades = Companies_Upgrades.objects.filter(company = company, game = game)

        response = dict()
        response['upgrade'] = list()

        for upgrade in companies_upgrades:
            try:
                response['upgrade'].append({
                    'name':Upgrade.objects.get(pk=company.upgrade).values('name'),
                    'players':Companies_Upgrades.objects.filter(upgrade = upgrade).values('company'),
                    'status':upgrade.status,
                    'price':Upgrade.objects.get(pk=company.upgrade).values('cost'),
                    'progress':upgrade.progess,
                    'camera_pos':Upgrade.objects.get(pk=company.upgrade).values('camera_pos'),
                    'camera_rot':Upgrade.objects.get(pk=company.upgrade).values('camera_rot'),
                })
            except:
                pass

        return response
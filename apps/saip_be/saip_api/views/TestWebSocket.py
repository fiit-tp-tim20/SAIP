from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class NotifyTrigger(APIView):
    def post(self, request) -> Response:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)("game", {"type": "game.notify", "text": "broadcast test"})
        return Response(status=201)

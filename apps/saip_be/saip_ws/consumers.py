import json
from knox.settings import CONSTANTS
from saip_api.models import Company, CompaniesState
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.auth import login
from knox.models import AuthToken
from channels.exceptions import DenyConnection
from saip_api.views.GameManagement import get_last_turn
from asgiref.sync import async_to_sync
from .triggers import broadcast_message

class TestConsumer(WebsocketConsumer):

    def get_user_company(self):
        try:
            if self.scope["user"].is_anonymous:
                return self.send(text_data="User is anonymous", close=True)
            company = Company.objects.get(user=self.scope["user"])
            return company
        except Company.DoesNotExist:
            self.send(text_data="Company for this user not found", close=True)

    def connect(self):
        self.accept('authorization')
        company = self.get_user_company()
        if company is None:
            return
        game_name = company.game.name
        async_to_sync(self.channel_layer.group_add)(game_name, self.channel_name) # predpokladame, ze sa zatial hra jedna hra v jednom case
        self.send(text_data="Websocket connected")
        turn = get_last_turn(company.game)
        state = CompaniesState.objects.get(turn=turn, company=company)
        y = {"Number": turn.number, "Committed": state.committed}
        q = json.dumps(y, indent=4, sort_keys=True, default=str)
        return self.send(text_data=q, close=False)

    def broadcast_to_all_users(self, message):
        broadcast_message(message)

    def game_message(self, event):
        message = event["text"]
        q = json.dumps(message, indent=4, sort_keys=True, default=str)
        print(q)
        return self.send(text_data=q, close=False)
        
    def disconnect(self, close_code):
        company = self.get_user_company()
        if company is None:
            return
        game_name = company.game.name
        async_to_sync(self.channel_layer.group_discard)(game_name, self.channel_name)
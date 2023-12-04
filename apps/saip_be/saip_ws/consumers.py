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
    def connect(self):
        token_key = (self.scope["subprotocols"][1])
        try:
            token = AuthToken.objects.get(token_key=token_key[:CONSTANTS.TOKEN_KEY_LENGTH])
            self.user = token.user
        except AuthToken.DoesNotExist:
            raise DenyConnection("Invalid token")
        self.accept()
        try:
            company = Company.objects.get(user=self.user)
        except Company.DoesNotExist:
            return self.send(text_data="Company for this user not found", close=True)
        async_to_sync(self.channel_layer.group_add)("game", self.channel_name)
        self.send(text_data="Websocket connected")
        turn = get_last_turn(company.game)
        state = CompaniesState.objects.get(turn=turn, company=company)
        y = {"Number": turn.number, "Start": turn.start, "Committed": state.committed}
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
        pass

# class TestConsumer2(WebsocketConsumer):
#     def connect(self):
#         token_key = (self.scope["subprotocols"][1])
#         try:
#             token = AuthToken.objects.get(token_key=token_key[:CONSTANTS.TOKEN_KEY_LENGTH])
#             self.user = token.user
#         except AuthToken.DoesNotExist:
#             raise DenyConnection("Invalid token")
#         self.accept()
#         try:
#             company = Company.objects.get(user=self.user)
#         except Company.DoesNotExist:
#             return self.send(text_data="Company for this user not found", close=True)
#         async_to_sync(self.channel_layer.group_add)("game", self.channel_name)
#         self.send(text_data="Websocket connected")
#         turn = get_last_turn(company.game)
#         state = CompaniesState.objects.get(turn=turn, company=company)
#         y = {"Number": turn.number, "Start": turn.start, "Committed": state.committed}
#         q = json.dumps(y, indent=4, sort_keys=True, default=str)
#         return self.send(text_data=q, close=False)
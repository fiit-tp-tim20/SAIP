import json
from knox.settings import CONSTANTS
from saip_api.models import Company, CompaniesState
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.auth import login
from knox.models import AuthToken
from channels.exceptions import DenyConnection
from saip_api.views.GameManagement import get_last_turn
from asgiref.sync import async_to_sync

class TestConsumer(WebsocketConsumer):
    def connect(self):
        token_key = (self.scope["subprotocols"][1])
        try:
            print(token_key)
            token = AuthToken.objects.get(token_key=token_key[:CONSTANTS.TOKEN_KEY_LENGTH])
            print(token)
            self.user = token.user
        except AuthToken.DoesNotExist:
            print("nee")
            raise DenyConnection("Invalid token")
        self.accept()
        try:
            company = Company.objects.get(user=self.user)
        except Company.DoesNotExist:
            print("neeee")
            return self.send(text_data="Company for this user not found", close=True)
        async_to_sync(self.channel_layer.group_add)("game", self.channel_name)
        self.send(text_data="Websocket connected")
        turn = get_last_turn(company.game)
        state = CompaniesState.objects.get(turn=turn, company=company)
        y = {"Number": turn.number, "Start": turn.start, "Committed": state.committed}
        q = json.dumps(y, indent=4, sort_keys=True, default=str)
        return self.send(text_data=q, close=False)

    def game_notify(self, event):
        print("**********NOTIFIED**********")
        self.send(text_data=event["text"])        

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print("Message:" + message)
        self.send(text_data=json.dumps({"message": message}))
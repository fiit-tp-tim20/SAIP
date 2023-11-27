import json

from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.auth import login
from asgiref.sync import async_to_sync

class TestConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        # if not self.user or not self.user.is_authenticated:
        #     return Response({"detail": "User is not authenticated"}, status=401)
        async_to_sync(self.channel_layer.group_add)("game", self.channel_name)
        self.accept()
        self.send(text_data="Websocket connected")

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
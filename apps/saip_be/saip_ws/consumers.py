import json

from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.auth import login

class TestConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        if not self.user or not self.user.is_authenticated:
            return Response({"detail": "User is not authenticated"}, status=401)
        self.accept()
        self.send(text_data="Websocket connected")
        

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print("Message:" + message)
        self.send(text_data=json.dumps({"message": message}))
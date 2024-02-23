# chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/turn_info/", consumers.TestConsumer.as_asgi()),
    re_path(r"ws/turn_end/", consumers.TestConsumer.as_asgi())
]
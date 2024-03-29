from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
def broadcast_message(message):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "game",
        {
            "type": "game_message",
            "text": message,
        },
    )
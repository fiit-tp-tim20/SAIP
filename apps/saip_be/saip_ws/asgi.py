import os
#TODO create and use saip_ws.settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saip_be.settings')
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from . import routing
from . import custom_auth


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            custom_auth.TokenAuthMiddleware(URLRouter(routing.websocket_urlpatterns))
        ),
    }
)

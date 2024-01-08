from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from knox.auth import TokenAuthentication
from rest_framework import HTTP_HEADER_ENCODING
from asgiref.sync import async_to_sync


@database_sync_to_async
def get_user(token):
    try:
        knoxAuth = TokenAuthentication()
        user, auth_token = knoxAuth.authenticate_credentials(token.encode(HTTP_HEADER_ENCODING))
        return user
    except Exception:
        return AnonymousUser()

# https://stackoverflow.com/questions/43392889/how-do-you-authenticate-a-websocket-with-token-authentication-on-django-channels
class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    #@database_sync_to_async # https://docs.djangoproject.com/en/4.2/topics/async/
    async def __call__(self, scope, receive, send):
        try:
            token = scope["subprotocols"][1]
        except ValueError:
            token = None   
        user = await get_user(token)
        scope['user'] = user
        return await super().__call__(scope, receive, send)

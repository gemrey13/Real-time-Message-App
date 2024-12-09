import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from services.urls import websocket_urlpatterns
from channels.auth import AuthMiddlewareStack
from services.channels_middleware import JWTWebsocketMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": application,
    "websocket": JWTWebsocketMiddleware(AuthMiddlewareStack(URLRouter(websocket_urlpatterns)))
})
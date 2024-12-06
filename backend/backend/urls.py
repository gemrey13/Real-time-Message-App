from django.contrib import admin
from django.urls import path
from services.views import register_user


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register_user, name="register"),
]

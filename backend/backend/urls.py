from django.contrib import admin
from django.urls import path
from services.views import register_user, login, get_user_list


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register_user, name="register"),
    path('login/', login, name="login"),
    path('api/users/', get_user_list, name="users"),
]

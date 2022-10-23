"""saip_be URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from saip_api.views.RegisterView import RegisterView
from saip_api.views.TestView import TestView
from saip_api.views.ChangePasswordView import ChangePasswordView
from saip_api.views.LoginView import LoginView
# from knox.views import LoginView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name="register"),
    path('test/', TestView.as_view(), name="test"),
    path('change_password/', ChangePasswordView.as_view(), name="change_password"),
    path('login/', LoginView.as_view(), name="login"),
]

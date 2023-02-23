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

from saip_api.views.UserManagement import RegisterView, LoginView, TestView, ChangePasswordView
from saip_api.views.Upgrade import UpgradeView
from saip_api.views.GameManagement import CreateGameView, GetRunningGamesView, EndTurnView
from saip_api.views.CompanyManagement import CreateCompanyView, PostSpendingsView, CompanyInfo, Report
from knox.views import LogoutView


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name="register"),
    path('api/test/', TestView.as_view(), name="test"),
    path('api/change_password/', ChangePasswordView.as_view(), name="change_password"),
    path('api/login/', LoginView.as_view(), name="login"),
    path('api/logout/', LogoutView.as_view(), name='knox_logout'),
    path('api/upgrades/', UpgradeView.as_view(), name='return_upgrades'),
    path('api/create_game/', CreateGameView.as_view(), name='create_game'),
    path('api/list_games/', GetRunningGamesView.as_view(), name='list_games'),
    path('api/create_company/', CreateCompanyView.as_view(), name='create_company'),
    path('api/end_turn/', EndTurnView.as_view(), name='end_turn'),
    path('api/spendings/', PostSpendingsView.as_view(), name='spendings'),
    path('api/company_info/', CompanyInfo.as_view(), name='company_info'),
    path('api/report/', Report.as_view(), name='report'),
]

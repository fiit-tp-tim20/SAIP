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

from saip_api.views.UserManagement import RegisterView, LoginView, ChangePasswordView
# from saip_api.views.UserManagement import TestView
from saip_api.views.Upgrade import UpgradeView
from saip_api.views.GameManagement import CreateGameView, GetRunningGamesView, EndTurnView, GetNotStartedGamesView
from saip_api.views.CompanyManagement import CreateCompanyView, PostSpendingsView, CompanyInfo, CompanyReport, \
    TurnInfoView, Committed, IndustryReport, MarketingView, CompanyView, IndustryView, ArchiveReport
from knox.views import LogoutView

from saip_api.views.TestWebSocket import NotifyTrigger


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name="register"),
    # path('api/test/', TestView.as_view(), name="test"), # uncomment the TestView in UserManagement.py to use this
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
    path('api/company_report/', CompanyReport.as_view(), name='company_report'),
    path('api/archive_report/', ArchiveReport.as_view(), name='archive_report'),
    path('api/committed/', Committed.as_view(), name='committed'),
    path('api/turn_info/', TurnInfoView.as_view(), name='turn_info'),
    path('api/industry_report/', IndustryReport.as_view(), name='industry_report'),
    path('api/marketing_view/', MarketingView.as_view(), name='marketing_view'),
    path('api/company_view/', CompanyView.as_view(), name='company_view'),
    path('api/list_games_ns/', GetNotStartedGamesView.as_view(), name='list_games_ns'),
    path('api/industry_view/', IndustryView.as_view(), name='industry_view'),
    path('api/wstrigger/', NotifyTrigger.as_view(), name='websocket_trigger')
]

"""cargobids URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
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
from django.urls import path, re_path

from django.conf.urls import url, include
from profiles import views as profile_views
from common import views as common_views
from django.views.generic.base import TemplateView

urlpatterns = [
    path('admin-URL-alwasy-SHOULD-be-hard-GET/', admin.site.urls),
    re_path(r'^cb/*', common_views.user, name='user'),
    re_path(r'^admin/*', common_views.admin, name='admin'),
    path('', common_views.home, name='home'),
    path('api/', include('api.urls')),
    path('api/login', profile_views.login),
    path('api/authenticate', profile_views.authenticate_user),
    path('api/logout', profile_views.logout),
    path('api/close-browser', profile_views.close_browser),
    path('api/check_login/<str:token>/', profile_views.check_login),
    
    path('api/registrations', profile_views.registrations),
    path('api/activations', profile_views.activations),
    path('api/account/complete', profile_views.registration_complete),

    path('api/reset/request', profile_views.password_reset_request),
    path('api/users/resetPassword', profile_views.update_password),
    path('api/activate-trial', profile_views.activate_trial),

    path('calculation', TemplateView.as_view(template_name='calculations.html')),

    path('api/import', profile_views.import_data),
    path('api/import_data', profile_views.import_data_air),
]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

]

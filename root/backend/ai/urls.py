"""
URL configuration for ai project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path, include
from app.views import * 
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/user/register/', UserView.as_view(), name="register"),
    path('app/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('app/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path('app-auth/', include("rest_framework.urls")),
    path("app/", include("app.urls")),
    # path('', TemplateView.as_view(template_name='index.html'))
]

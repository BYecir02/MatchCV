from django.urls import path
from django.contrib import admin
from .views import RegisterView, LoginView, LogoutView, DashboardView, ProfileView

urlpatterns = [
    path('',LoginView.as_view(), name='login'),  # Redirige vers la page de connexion par défaut
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),  
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/', admin.site.urls),
]
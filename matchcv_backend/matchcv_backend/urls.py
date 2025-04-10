from django.contrib import admin
from django.urls import path, include
from users.views import LoginView  # Import direct pour la page par défaut

urlpatterns = [
    path('', LoginView.as_view(), name='login'),  # Page par défaut sans API
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),  # Inclut les URLs de users
]
from django.urls import path
from .views import RegisterView, LoginView, LogoutView, DashboardView, ProfileView, DeleteExperienceView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/experience/<int:experience_id>/', DeleteExperienceView.as_view(), name='delete_experience'),
]
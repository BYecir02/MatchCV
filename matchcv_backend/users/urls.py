from django.urls import path
from .views import RegisterView, LoginView, LogoutView, DashboardView, ProfileView, DeleteExperienceView, AddExperienceView, UpdateExperienceView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/experience/<int:experience_id>/', DeleteExperienceView.as_view(), name='delete_experience'),
    path('profile/experience/add/', AddExperienceView.as_view(), name='add_experience'),
    path('profile/experience/<int:experience_id>/update/', UpdateExperienceView.as_view(), name='update_experience'),
]
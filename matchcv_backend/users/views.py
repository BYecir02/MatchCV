from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, ProfileSerializer, ExperienceSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .models import Profile, Experience, PersonalDetail, ProfessionalStatus, AboutPersonality, AboutMotivation, TechnicalSkill, Language

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({'error': 'Compte désactivé'}, status=status.HTTP_403_FORBIDDEN)
            user = authenticate(username=user.username, password=password)
        except User.DoesNotExist:
            user = None

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token requis"}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Déconnexion réussie"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f"Bienvenue {request.user.username} sur votre tableau de bord !",
            "username": request.user.username
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile, data=request.data)
        except Profile.DoesNotExist:
            serializer = ProfileSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            profile = request.user.profile
            profile.delete()
            return Response({"message": "Profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteExperienceView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, experience_id):
        try:
            experience = Experience.objects.get(id=experience_id, profile=request.user.profile)
            experience.delete()
            return Response({"message": "Expérience supprimée avec succès"}, status=status.HTTP_204_NO_CONTENT)
        except Experience.DoesNotExist:
            return Response({"error": "Expérience non trouvée ou non autorisée"}, status=status.HTTP_404_NOT_FOUND)

class AddExperienceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(profile=request.user.profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateExperienceView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, experience_id):
        try:
            experience = Experience.objects.get(id=experience_id, profile=request.user.profile)
            serializer = ExperienceSerializer(experience, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Experience.DoesNotExist:
            return Response({"error": "Expérience non trouvée ou non autorisée"}, status=status.HTTP_404_NOT_FOUND)
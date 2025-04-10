from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # 1. Identité
    full_name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    profile_image = models.URLField(blank=True)
    
    # 2. Informations personnelles (JSON)
    personal_details = models.JSONField(default=dict)
    
    # 3. Situation professionnelle (JSON)
    professional_status = models.JSONField(default=dict)
    
    # 4. À propos
    about_summary = models.TextField(blank=True)
    about_personality = models.JSONField(default=list)  # Remplace ArrayField
    about_motivations = models.JSONField(default=list)  # Remplace ArrayField
    
    # 5. Compétences (JSON)
    technical_skills = models.JSONField(default=dict)
    
    # 6. Langues (JSON)
    languages = models.JSONField(default=list)
    
    # 7. Centres d'intérêt (JSON)
    interests = models.JSONField(default=list)

    def __str__(self):
        return f"Profil de {self.user.username}"

# Modèles pour les relations multiples
class Education(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    details = models.JSONField(default=list)  # Remplace ArrayField

class Experience(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='experiences')
    position = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    responsibilities = models.JSONField(default=list)  # Remplace ArrayField
    achievements = models.JSONField(default=list)  # Remplace ArrayField

class Project(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    description = models.TextField()
    technologies = models.JSONField(default=list)  # Remplace ArrayField
    features = models.JSONField(default=list)  # Remplace ArrayField
    link = models.URLField(blank=True)
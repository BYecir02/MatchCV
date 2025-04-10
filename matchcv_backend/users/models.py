from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Identité
    full_name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    profile_image = models.URLField(blank=True)

    # Informations personnelles
    birth_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    driving_license = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Profil de {self.user.username}"

class PersonalDetail(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='personal_details')
    birth_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    driving_license = models.CharField(max_length=50, blank=True)

class ProfessionalStatus(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='professional_status')
    current_status = models.CharField(max_length=255, blank=True)
    work_rhythm = models.CharField(max_length=100, blank=True)
    availability = models.CharField(max_length=100, blank=True)
    desired_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    mobility = models.CharField(max_length=100, blank=True)

class AboutPersonality(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='about_personality')
    trait = models.CharField(max_length=255)

class AboutMotivation(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='about_motivations')
    motivation = models.CharField(max_length=255)

class TechnicalSkill(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='technical_skills')
    category = models.CharField(max_length=100)  # e.g., "language", "framework", "tool"
    name = models.CharField(max_length=100)
    level = models.IntegerField(null=True, blank=True)  # e.g., 0-10 scale
    projects_count = models.IntegerField(null=True, blank=True)

class Language(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='languages')
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=100)  # e.g., "Beginner", "Intermediate", "Fluent"
    certification = models.CharField(max_length=255, blank=True)

class Interest(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='interests')
    category = models.CharField(max_length=100)
    activity = models.CharField(max_length=255)

class Education(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    details = models.TextField(blank=True)  # Store details as a single text field

class Experience(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='experiences')
    position = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    responsibilities = models.JSONField(blank=True, default=list)  # Stocker les responsabilités sous forme de liste
    achievements = models.JSONField(blank=True, default=list)  # Stocker les réalisations sous forme de liste

    def __str__(self):
        return f"{self.position} at {self.company}"

class Project(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    description = models.TextField()
    technologies = models.TextField(blank=True)  # Store technologies as a comma-separated string
    features = models.TextField(blank=True)  # Store features as a comma-separated string
    link = models.URLField(blank=True)
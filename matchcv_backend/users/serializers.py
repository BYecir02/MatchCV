from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, PersonalDetail, ProfessionalStatus, AboutPersonality, AboutMotivation,
    Education, Experience, Project, TechnicalSkill, Language, Interest
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class PersonalDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetail
        fields = ['birth_date', 'nationality', 'address', 'phone', 'email', 'linkedin', 'github', 'driving_license']

class ProfessionalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalStatus
        fields = ['current_status', 'work_rhythm', 'availability', 'desired_salary', 'mobility']

class AboutPersonalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPersonality
        fields = ['trait']

class AboutMotivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMotivation
        fields = ['motivation']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['degree', 'institution', 'period', 'details']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['position', 'company', 'period', 'location', 'responsibilities', 'achievements']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'role', 'period', 'description', 'technologies', 'features', 'link']

class TechnicalSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalSkill
        fields = ['category', 'name', 'level', 'projects_count']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['name', 'level', 'certification']

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['category', 'activity']

class ProfileSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, required=False)  # Ajouté

    class Meta:
        model = Profile
        fields = [
            'full_name', 'title', 'profile_image', 'birth_date', 'nationality',
            'address', 'phone', 'email', 'linkedin', 'github', 'driving_license', 'experiences'
        ]

    def update(self, instance, validated_data):
        experiences_data = validated_data.pop('experiences', [])
        instance = super().update(instance, validated_data)

        existing_experiences = {exp.id: exp for exp in instance.experiences.all()}
        for exp_data in experiences_data:
            exp_id = exp_data.get('id', None)
            if exp_id and exp_id in existing_experiences:
                exp = existing_experiences[exp_id]
                for attr, value in exp_data.items():
                    setattr(exp, attr, value)
                exp.save()
            else:
                Experience.objects.create(profile=instance, **exp_data)
        
        return instance
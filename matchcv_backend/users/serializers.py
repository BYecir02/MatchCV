from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Education, Experience, Project

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

class ProfileSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True)
    experiences = ExperienceSerializer(many=True)
    projects = ProjectSerializer(many=True)

    class Meta:
        model = Profile
        fields = [
            'full_name', 'title', 'profile_image', 'personal_details',
            'professional_status', 'about_summary', 'about_personality',
            'about_motivations', 'technical_skills', 'languages', 'interests',
            'education', 'experiences', 'projects'
        ]

    def create(self, validated_data):
        education_data = validated_data.pop('education')
        experiences_data = validated_data.pop('experiences')
        projects_data = validated_data.pop('projects')
        
        profile = Profile.objects.create(**validated_data)
        
        for edu in education_data:
            Education.objects.create(profile=profile, **edu)
        for exp in experiences_data:
            Experience.objects.create(profile=profile, **exp)
        for proj in projects_data:
            Project.objects.create(profile=profile, **proj)
        
        return profile

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.title = validated_data.get('title', instance.title)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.personal_details = validated_data.get('personal_details', instance.personal_details)
        instance.professional_status = validated_data.get('professional_status', instance.professional_status)
        instance.about_summary = validated_data.get('about_summary', instance.about_summary)
        instance.about_personality = validated_data.get('about_personality', instance.about_personality)
        instance.about_motivations = validated_data.get('about_motivations', instance.about_motivations)
        instance.technical_skills = validated_data.get('technical_skills', instance.technical_skills)
        instance.languages = validated_data.get('languages', instance.languages)
        instance.interests = validated_data.get('interests', instance.interests)

        if 'education' in validated_data:
            instance.education.all().delete()
            for edu_data in validated_data['education']:
                Education.objects.create(profile=instance, **edu_data)
        
        if 'experiences' in validated_data:
            instance.experiences.all().delete()
            for exp_data in validated_data['experiences']:
                Experience.objects.create(profile=instance, **exp_data)
        
        if 'projects' in validated_data:
            instance.projects.all().delete()
            for proj_data in validated_data['projects']:
                Project.objects.create(profile=instance, **proj_data)

        instance.save()
        return instance
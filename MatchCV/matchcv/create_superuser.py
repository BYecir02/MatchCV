from django.contrib.auth import get_user_model

# Crée un superutilisateur (nom, email, mot de passe)
User = get_user_model()
User.objects.create_superuser(
    username="yecir", 
    email="badiirouyecir@gmail.com", 
    password="B03111969c"  # ⚠ Remplace ceci par un mot de passe fort !
)
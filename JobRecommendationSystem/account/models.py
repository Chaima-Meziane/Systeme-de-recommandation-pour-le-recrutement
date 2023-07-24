from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    is_candidat = models.BooleanField('Is candidat', default=False)
    is_coordinateur = models.BooleanField('Is coordinateur', default=False)
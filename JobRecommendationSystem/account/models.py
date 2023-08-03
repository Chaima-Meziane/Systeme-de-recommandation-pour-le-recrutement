from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    phone_number = models.CharField(max_length=8,  default='')
    address = models.CharField(max_length=50,  default='')
    resume = models.FileField(upload_to='pdfs/', null=True)
    is_candidat = models.BooleanField('Is candidat', default=False)
    is_coordinateur = models.BooleanField('Is coordinateur', default=False)
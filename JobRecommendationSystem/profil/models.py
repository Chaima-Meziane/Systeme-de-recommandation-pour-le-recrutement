from django.db import models
from offre.models import Offre
# Create your models here.
class Profil(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)
    url = models.URLField()
    skills = models.TextField()
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
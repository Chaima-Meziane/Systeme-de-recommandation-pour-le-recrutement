from django.db import models
from candidature.models import Candidature
from account.models import User

# Create your models here.
class Entretien(models.Model):
    heure = models.TimeField()
    date = models.DateField(null=True, blank=True)
    # Choix pour le champ "resultat"
    
    CHOIX_RESULTAT = (
        ('accepte', 'Accepté'),
        ('en_attente', 'En attente'),
        ('refuse', 'Refusé'),
    )
    # Champ "resultat" de type CharField avec les choix définis
    resultat = models.CharField(max_length=20,default='en_attente', choices=CHOIX_RESULTAT)
    candidature = models.OneToOneField(Candidature, on_delete=models.CASCADE)
    coordinateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entretiens',default='')
    
from django.db import models
from candidature.models import Candidature
from account.models import User
import datetime  # Import the datetime module


class Entretien(models.Model):
    heure_debut = models.TimeField(default=datetime.time(12, 0))
    heure_fin = models.TimeField(default=datetime.time(12, 30)) 
    date = models.DateField(null=True, blank=True)
    
    # Choices for the "resultat" field
    CHOIX_RESULTAT = (
        ('accepte', 'Accepté'),
        ('en_attente', 'En attente'),
        ('refuse', 'Refusé'),
    )
    
    # Field "resultat" of type CharField with the defined choices
    resultat = models.CharField(max_length=20, default='en_attente', choices=CHOIX_RESULTAT)
    
    # ForeignKey to Candidature model
    candidature = models.ForeignKey(Candidature, on_delete=models.CASCADE, default=None, null=True)
    
    # ForeignKey to User model for the coordinator
    coordinateur = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)
    lien_reunion = models.URLField(blank=True, null=True)

    
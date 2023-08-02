from django.db import models

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
    
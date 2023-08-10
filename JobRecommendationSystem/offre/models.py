from django.db import models
from account.models import User
# Create your models here.
class Offre(models.Model):
    
    StatutOffre=[
        ('Ouvert', 'Ouvert'),
        ('Fermé', 'Fermé'),
    ]
    TypeEmploi=[
        ('Temporaire', 'Temporaire'),
        ('Permanent', 'Permanent'),
    ]

   
    titreDuPoste = models.CharField(max_length=255)
    description = models.TextField()
    competences = models.TextField()
    entreprise = models.CharField(max_length=255)
    localisation = models.CharField(max_length=255)
    statut = models.CharField(max_length=10, choices=StatutOffre, default='Ouvert')
    typeEmploi = models.CharField(max_length=15, choices=TypeEmploi, default='Permanent')
    coordinateurs = models.ManyToManyField(User, related_name='coordinateur_offres', blank=True, limit_choices_to={'is_candidat': True})

    def __str__(self):
        return self.titreDuPoste

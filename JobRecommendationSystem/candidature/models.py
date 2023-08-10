from django.db import models
from account.models import User
from offre.models import Offre


class Candidature(models.Model):

    
    EtatCandidature = [
        ('En attente', 'En attente'),
        ('Rejetée', 'Rejetée'),
        ('Acceptée', 'Acceptée'),
    ]

    lettre_de_motivation = models.FileField(upload_to='pdfs/lettresDeMotivation/', null=True)
    etat = models.CharField(max_length=10, choices=EtatCandidature, default='En attente')

    candidat = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)
    
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE,default=None, null=True)



    def __str__(self):
        return f"Candidature {self.pk} - {self.get_etat_display()}"



  
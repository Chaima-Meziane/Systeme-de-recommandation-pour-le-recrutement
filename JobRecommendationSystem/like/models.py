from django.db import models
from account.models import User
from offre.models import Offre
# Create your models here.
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
from django.shortcuts import render
from .models import Offre
from .serializer import OffreSerializer
from rest_framework import viewsets

# Create your views here.

class OffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all()
    serializer_class = OffreSerializer

from rest_framework import serializers
from offre.models import Offre


class OffreSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Offre
        fields = '__all__'
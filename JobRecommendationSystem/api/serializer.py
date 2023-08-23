from rest_framework import serializers
from entretien.models import Entretien
from account.models import User
from candidature.models import Candidature
from offre.models import Offre
from profil.models import Profil


class UserSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(required=False)
    password = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_coordinateur', 'is_candidat', 'phone_number', 'address', 'resume', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}
    def to_representation(self, instance):
        # Exclude 'password' from the response data
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret



class EntretienSerializer(serializers.ModelSerializer):
    resultat = serializers.CharField(default='en_attente', required=False)
    candidature = serializers.PrimaryKeyRelatedField(queryset=Candidature.objects.all(), required=False)
    coordinateur = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    
    class Meta:
        model = Entretien
        fields = '__all__'

class CandidatureSerializer(serializers.ModelSerializer):
    lettre_de_motivation = serializers.FileField(required=False)
    class Meta:
        model = Candidature
        fields = '__all__'




class CandidatureDisplaySerializer(serializers.ModelSerializer):
    lettre_de_motivation = serializers.FileField(required=False)
    candidat = UserSerializer(read_only=True)  # Champ de lecture seule pour l'affichage
    class Meta:
        model = Candidature
        fields = '__all__'



class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = '__all__'

class ProfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profil
        fields = '__all__'  
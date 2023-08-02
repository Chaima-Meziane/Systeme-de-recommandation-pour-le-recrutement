from rest_framework import serializers
from entretien.models import Entretien
from account.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_coordinateur', 'is_candidat')
        extra_kwargs = {'password': {'write_only': True}}

class EntretienSerializer(serializers.ModelSerializer):

    class Meta:
        model = Entretien
        fields = '__all__'
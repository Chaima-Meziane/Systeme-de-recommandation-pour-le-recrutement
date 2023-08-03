from rest_framework import serializers
from entretien.models import Entretien
from account.models import User

class UserSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(required=False)
    password = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_coordinateur', 'is_candidat', 'phone_number', 'address', 'resume')
        extra_kwargs = {'password': {'write_only': True}}
    def to_representation(self, instance):
        # Exclude 'password' from the response data
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret

class EntretienSerializer(serializers.ModelSerializer):

    class Meta:
        model = Entretien
        fields = '__all__'
    
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from entretien.models import Entretien
from account.models import User
from api.serializer import EntretienSerializer
from api.serializer import UserSerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password


@api_view(['GET'])
def getEntretiens(request):
    entretiens = Entretien.objects.all()
    serializer = EntretienSerializer(entretiens, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def addEntretien(request):
    try:
        serializer = EntretienSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def updateEntretien(request, id=None):
    entretien = Entretien.objects.get(id=id)

    serializer = EntretienSerializer(instance=entretien, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateUser(request, id=None):
    user = User.objects.get(id=id)

    serializer = UserSerializer(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteEntretien(request, id=None):
    entretien = Entretien.objects.get(id=id)
    entretien.delete()
    return Response("L'entretien a été  supprimé avec succès.")



@api_view(['POST'])
def register_api(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Récupérer le mot de passe de la requête et le hacher
            raw_password = serializer.validated_data['password']
            hashed_password = make_password(raw_password)

            # Enregistrer l'utilisateur avec le mot de passe haché
            serializer.save(password=hashed_password)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
# Vue pour la connexion de l'utilisateur
class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
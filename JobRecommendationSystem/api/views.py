from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from entretien.models import Entretien
from account.models import User
from api.serializer import EntretienSerializer, CandidatureSerializer, UserSerializer, OffreSerializer, CandidatureDisplaySerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views import View
from offre.models import Offre
from django.shortcuts import get_object_or_404
from candidature.models import Candidature


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'}, status=200)
    

@api_view(['GET'])
def getEntretiens(request):
    entretiens = Entretien.objects.all()
    serializer = EntretienSerializer(entretiens, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



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

@api_view(['POST'])
def addCandidature(request):
    try:
        serializer = CandidatureSerializer(data=request.data)
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

    
from django.contrib.auth import get_user_model

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                # Add other user fields you want to include
            }
            return Response({"message": "Login successful", "user": user_data}, status=status.HTTP_200_OK)
        
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    


# Vue pour la connexion de l'utilisateur avec linkedIn
class LinkedInAuthView(View):
    def get(self, request):
        # Construire l'URL d'autorisation LinkedIn
        auth_url = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=7829tbzcy4b4hq&redirect_uri=http://localhost:5173&state=SOME_RANDOM_STATE&scope=r_liteprofile%20r_emailaddress'

        # Construire la réponse JSON avec l'URL d'autorisation LinkedIn
        response_data = {
            'auth_url': auth_url,
        }

        # Renvoyer la réponse JSON
        return JsonResponse(response_data)




@api_view(['POST'])
def addOffre(request):
    try:
        serializer = OffreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Offre.DoesNotExist:
        return Response({'error': 'Offre not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def updateOffre(request, id=None):
    offre = get_object_or_404(Offre, id=id)

    serializer = OffreSerializer(instance=offre, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)  # Use 200 for successful updates
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getOffres(request):
    offres = Offre.objects.all()
    serializer = OffreSerializer(offres, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



class GetOffreByID(APIView):
    def get(self, request, offre_id):
        try:
            offre = Offre.objects.get(pk=offre_id)
            serializer = OffreSerializer(offre)  # Utilisez votre serializer pour sérialiser l'offre
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Offre.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getOffresByCoordinator(request, coordinator_id):
    offres = Offre.objects.filter(coordinateur_id=coordinator_id)
    serializer = OffreSerializer(offres, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_candidatures_by_offre(request, offre_id):
    try:
        candidatures = Candidature.objects.filter(offre_id=offre_id).select_related('candidat')
        serializer = CandidatureDisplaySerializer(candidatures, many=True)
        return Response(serializer.data)
    except Candidature.DoesNotExist:
        return Response({'error': 'Candidatures not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import urllib.parse
import time
from time import sleep
import urllib.parse
from offre.models import Offre
from profil.models import Profil


@csrf_exempt
def login_to_linkedin(request):
    if request.method == 'POST':
        try:
            profile_to_search = request.POST.get('profile_to_search')
            driver = webdriver.Chrome()
            url = 'https://www.linkedin.com/login'
            driver.get(url)
            sleep(2)
            
            username = request.POST.get('username')
            password = request.POST.get('password')

            email_field = driver.find_element(By.ID, 'username')
            email_field.send_keys(username)
            sleep(2)
                        
            password_field = driver.find_element(By.ID, 'password')
            password_field.send_keys(password)
            
            login_field = driver.find_element(By.XPATH, '//*[@id="organic-div"]/form/div[3]/button')
            login_field.click()
            sleep(3)
            
            search_field = driver.find_element(By.XPATH,'//*[@id="global-nav-typeahead"]/input')
            search_field.send_keys(profile_to_search)
            search_field.send_keys(Keys.RETURN)
            print('- Finish Task 2: Search for profiles')
            sleep(2)

            language = driver.find_element(By.XPATH, '//html').get_attribute('lang')
            sleep(2)
            if language == 'fr':
                people_button = driver.find_element(By.XPATH, '//*[@id="search-reusables__filters-bar"]/ul/li/button[text()="Personnes"]')
            else:
                people_button = driver.find_element(By.XPATH, '//*[@id="search-reusables__filters-bar"]/ul/li/button[text()="People"]')
            sleep(2)
            people_button.click()
            sleep(2)
            URLs_all_page = []
            for page in range(1):
                URLs_one_page = GetURL(driver)
                sleep(2)
                driver.execute_script('window.scrollTo(0, document.body.scrollHeight);') #scroll to the end of the page
                sleep(3)
                next_button = driver.find_element(By.CLASS_NAME, "artdeco-pagination__button--next")
                driver.execute_script("arguments[0].click();", next_button)
                URLs_all_page = URLs_all_page + URLs_one_page
                sleep(2)

            print('- Finish Task 3: Scrape the URLs')

            # Garder uniquement les urls des profils filtrés
            urls_filtered = [url for url in URLs_all_page if url.startswith("https://www.linkedin.com/in/")]


            profiles_data = []
            for linkedin_URL in urls_filtered:
                driver.get(linkedin_URL)
                print('- Accessing profile: ', linkedin_URL)

                page_source = BeautifulSoup(driver.page_source, "html.parser")

                info_div = page_source.find('div',{'class':'mt2 relative'})
                location = info_div.find('span',{'class':'text-body-small inline t-black--light break-words'}).get_text().strip()
                sleep(1)
                print('--- Profile location is: ', location)
                name = info_div.find('h1').get_text().strip()
                sleep(1)
                print('--- Profile name is: ', name) 
                title = info_div.find('div',{'class':"text-body-medium break-words"}).get_text().strip()
                sleep(1)
                print('--- Profile title is: ', title)

                sleep(2)
                skills = extractSkills(driver)
                
                profile_data = {
                    'Name': name,
                    'Location': location,
                    'Job Title': title,
                    'URL': linkedin_URL,
                    'Skills': skills
                }
                profiles_data.append(profile_data)

                print('--- Profile skills: \n',skills)
                print('\n')

            driver.quit()

            # Récupérer l'ID de l'offre depuis la requête POST
            offre_id = int(request.POST.get('offre'))

            for profile_data in profiles_data:
                offre = Offre.objects.get(id=offre_id)
                profil = Profil.objects.create(
                    name=profile_data['Name'],
                    location=profile_data['Location'],
                    job_title=profile_data['Job Title'],
                    url=profile_data['URL'],
                    skills=', '.join(profile_data['Skills']),
                    offre=offre
                )

            return JsonResponse({'message': 'Profils ajoutés avec succès !'})

        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request method'})

def GetURL(driver):
    page_source = BeautifulSoup(driver.page_source)
    profiles = page_source.find_all('a', class_="app-aware-link")
    all_profile_URL = []
    for profile in profiles:
        profile_ID = profile.get('href')
        decoded_profile_URL = urllib.parse.unquote(profile_ID)
        profile_URL = decoded_profile_URL.split('?')[0] + '/'
        if profile_URL not in all_profile_URL:
            all_profile_URL.append(profile_URL)
    return all_profile_URL

def extractSkills(driver):
    # Obtenez le code HTML de la page
    page_source = BeautifulSoup(driver.page_source, "html.parser")

    # Recherchez tous les éléments <a> avec la classe spécifiée hedhy feha afficher les competences, projets...
    # On cherche le bouton qui mène à la liste complète des compétences
    elements = page_source.find_all('a', {'class': 'optional-action-target-wrapper artdeco-button artdeco-button--tertiary artdeco-button--standard artdeco-button--2 artdeco-button--muted inline-flex justify-center full-width align-items-center artdeco-button--fluid'})

    # Parcourez les éléments pour trouver celui contenant les compétences
    competences_element = None
    for element in elements:
        span_text = element.find('span', {'class': 'pvs-navigation__text'})
        # Recherchez le bouton permettant l'affichage de la liste complète des compétences
        if span_text and ('compétences' in span_text.text.lower() or 'skills' in span_text.text.lower()): 
            competences_element = element
            break

    # Cas 1: Aucune compétence n'a été trouvée
    page_source = BeautifulSoup(driver.page_source, "html.parser")
    les_balises_a =  page_source.find_all('a', {'data-field': 'skill_card_skill_topic'})
    if les_balises_a ==[]:
        competences=[]
        

    
    # Cas 2: Le nombre de compétences est supérieur à 3
    elif competences_element is not None:
        # Récupérer l'URL du lien
        href = competences_element['href']
    
        # Construire le script JavaScript pour cliquer sur le lien
        script = f"window.location = '{href}';"
    
        # Exécuter le script en utilisant execute_script()
        driver.execute_script(script)
        sleep(2)
    
        # Obtenez le code HTML de la page après avoir cliqué sur le bouton
        page_source_skills = BeautifulSoup(driver.page_source, "html.parser")
    
        # Liste pour stocker les compétences extraites
        competences = []  

        # Les balises <a> contenant les compétences
        skills_list = page_source_skills.find_all('a',{'data-field':'skill_page_skill_topic'})
        for a in skills_list:
            spans=a.find_all('span',{'aria-hidden':'true'})
            for span in spans:
                skill=span.get_text()
                if skill not in competences:
                    competences.append(skill)
                
        # Naviguer en arrière pour retourner au profil
        driver.back()


    
    #Cas 2: Le nombre de compétences est inférieur ou égale à 3
    else:
        #print("Le bouton 'Afficher les compétences' n'a pas été trouvé.")
        # Les balises <a> conteneant les compétences
        info_skills_alt =  page_source.find_all('a', {'data-field': 'skill_card_skill_topic'})
        # Liste pour stocker les compétences extraites
        competences=[]
        for a in info_skills_alt:
            spans=a.find_all('span',{'aria-hidden':'true'})
            for span in spans:
                # Extraire les textes à partir des balises <span>
                skill=span.get_text()
                if skill not in competences:
                    competences.append(skill)
    return competences
# views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


def calculate_cosine_similarity(vector1, vector2):
    # Calculate cosine similarity between two vectors
    similarity = cosine_similarity([vector1], [vector2])[0][0]
    return similarity

from sklearn.feature_extraction.text import TfidfVectorizer

import re  # Import the regular expression module

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

def get_offer_recommendations(request, offer_id):
    offer = get_object_or_404(Offre, id=offer_id)
    offer_skills = offer.competences.split(',')  # Split skills into a list

    related_profiles = Profil.objects.filter(offre=offer_id)

    # Collect all skills for related profiles
    profile_skills = []

    for profile in related_profiles:
        cleaned_skills = [skill.strip() for skill in profile.skills.split(',')]
        profile_skills.append(' '.join(cleaned_skills))

    # Combine offer and profile skills for Count Vectorization
    all_skills = offer_skills + profile_skills

    # Convert skills to numerical vectors using Count Vectorization
    vectorizer = CountVectorizer()
    skill_vectors = vectorizer.fit_transform(all_skills)

    # Get the vector for the offer
    offer_vector = skill_vectors[0]

    recommendations = []

    for idx, profile in enumerate(related_profiles):
        profile_vector = skill_vectors[idx + 1]  # Skip the first vector (offer vector)
        similarity = cosine_similarity(offer_vector.reshape(1, -1), profile_vector.reshape(1, -1))[0][0]
        if similarity !=0:
            recommendations.append((profile, similarity))

    recommendations.sort(key=lambda x: x[1], reverse=True)

    recommended_data = [
        {
            "id": profile.id,
            "name": profile.name,
            "skills": profile.skills,
            "url": profile.url,  # Adjust this field to the actual URL field of the profile
            "similarity_score": similarity
        }
        for profile, similarity in recommendations
    ]

    return JsonResponse({"offer": offer.titreDuPoste, "recommended_profiles": recommended_data})

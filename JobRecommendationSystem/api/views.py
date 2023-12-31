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
from django.core.exceptions import ObjectDoesNotExist
from like.models import Like

class GetEntretienByID(APIView):
    def get(self, request, entretien_id):
        try:
            entretien = Entretien.objects.get(pk=entretien_id)
            serializer = EntretienSerializer(entretien)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Entretien.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class GetUserByID(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

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
def addCandidature(request):
    try:
        candidat_id = request.data.get('candidat')  # Récupérez l'objet User à partir du corps de la requête
        offre_id = request.data.get('offre')  # Récupérez l'objet Offre à partir du corps de la requête
        
        candidat = User.objects.get(id=candidat_id)
        offre = Offre.objects.get(id=offre_id)
        
        try:
            existing_candidature = Candidature.objects.get(candidat=candidat, offre=offre)
            return Response({'message': 'Vous avez déjà postulé à cette offre.'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            serializer = CandidatureSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

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
    entretien = get_object_or_404(Entretien, id=id)
    serializer = EntretienSerializer(instance=entretien, data=request.data)

    if serializer.is_valid():
        ancien_etat = entretien.resultat
        serializer.save()

        # If the new state is "Accepted" or "Rejected" and the old state was "Pending"
        if entretien.resultat in ['accepte', 'refuse'] and ancien_etat == 'en_attente':
            candidature = Candidature.objects.get(id=entretien.candidature.id)
            candidat_id = candidature.candidat.id
            candidat = User.objects.get(id=candidat_id)
            envoyer_email_resultat(candidat, entretien)  # Pass the User object and the entretien

            return Response({'message': f"Entretien state updated and email sent to {candidat.email}."}, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Entretien state updated, but no email sent."}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def envoyer_email_resultat(user, entretien):
    subject = "Résultat de l'entretien"

    if entretien.resultat == 'accepte':
        message = f"Cher(e) {user.first_name} {user.last_name},\n\nFélicitations ! Nous sommes ravis de vous informer que vous avez été retenu(e) pour le poste de '{entretien.candidature.offre.titreDuPoste}'. Votre performance lors de l'entretien a été remarquable, et nous sommes convaincus que vous apporterez une grande valeur à notre équipe.\n\nToutes nos félicitations encore une fois, et nous avons hâte de vous accueillir dans notre entreprise. Vous recevrez bientôt des informations détaillées sur le processus d'intégration.\n\nCordialement,\n"
    elif entretien.resultat == 'refuse':
        message = f"Cher(e) {user.first_name} {user.last_name},\n\nNous tenons à vous exprimer notre sincère gratitude pour l'intérêt que vous avez manifesté envers le poste de '{entretien.candidature.offre.titreDuPoste}' au sein de notre entreprise. Après une évaluation attentive de votre candidature et de l'entretien, nous regrettons de vous informer que nous avons décidé de poursuivre avec d'autres candidats.\n\nNous reconnaissons la valeur de vos compétences et de votre expérience, et espérons que vous trouverez bientôt une opportunité qui correspondra parfaitement à votre profil. Nous vous souhaitons le meilleur dans vos recherches professionnelles futures.\n\nCordialement,\n"

    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]
        
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

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

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.core.files.storage import default_storage
from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Generate a URL to download the user's resume
            if user.resume:
                resume_url = default_storage.url(user.resume.name)
            else:
                resume_url = None
            
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_candidat': user.is_candidat,
                'is_coordinateur': user.is_coordinateur,
                'resume_url': resume_url,  # Include the resume URL
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


        
class GetCandidatureByID(APIView):
    def get(self, request, candidature_id):
        try:
            candidature = Candidature.objects.get(pk=candidature_id)
            serializer = CandidatureSerializer(candidature)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Candidature.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getOffresByCoordinator(request, coordinator_id):
    offres = Offre.objects.filter(coordinateur_id=coordinator_id)
    serializer = OffreSerializer(offres, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getEntretiensByCoordinateur(request, coordinator_id):
    entretiens = Entretien.objects.filter(coordinateur=coordinator_id)
    serializer =EntretienSerializer(entretiens, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getEntretiensByCandidat(request, candidat_id):
    try:
        candidatures = Candidature.objects.filter(candidat=candidat_id)
        candidature_ids = [candidature.id for candidature in candidatures]
        entretiens = Entretien.objects.filter(candidature__id__in=candidature_ids)
        serializer = EntretienSerializer(entretiens, many=True)
        return Response(serializer.data)
    except Entretien.DoesNotExist:
        return Response({'error': 'No Entretien found for the given Candidat ID'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

            """
            ## Chemin du ChromeDriver
            chemin_du_chromedriver = "C:\\Users\\Admin\\Downloads\\chromedriver.exe"

            # Configurez les options du navigateur avec le chemin du ChromeDriver
            chrome_options = Options()
            chrome_options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
            chrome_options.add_argument(f"webdriver.chrome.driver={chemin_du_chromedriver}")

            # Initialisez le navigateur Chrome avec les options
            driver = webdriver.Chrome(options=chrome_options)
            """

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
            for page in range(2):
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
                sleep(2)
                page_source = BeautifulSoup(driver.page_source, "html.parser")
                sleep(2)
                info_div = page_source.find('div',{'class':'mt2 relative'})
                sleep(2)

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
            "similarity_score": similarity, 
            "location": profile.location,
            "job_title": profile.job_title
        }
        for profile, similarity in recommendations
    ]

    return JsonResponse({"offer": offer.titreDuPoste, "recommended_profiles": recommended_data})




from django.views.decorators.csrf import csrf_exempt

import PyPDF2


def extract_text_from_pdf(pdf_file_path):
    with open(pdf_file_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        cv_text = ''
        for page in pdf_reader.pages:
            cv_text += page.extract_text()
        
        return cv_text





import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity



# Fonction pour calculer la similarité cosinus entre deux ensembles de compétences
def calculate_cosine_similarity__(offer_skills, cv_text):
    offer_skills_list = [skill.strip() for skill in offer_skills.split(',')]
    cv_text_list = [skill.strip() for skill in cv_text.split(',')]

    # Créer un ensemble de toutes les compétences uniques
    all_skills = set(offer_skills_list + cv_text_list)

    # Convertir l'ensemble de compétences en une chaîne de texte avec des virgules
    all_skills_text = ', '.join(all_skills)

    # Créer un objet CountVectorizer
    vectorizer = CountVectorizer()

    # Calculer la matrice des fréquences de termes pour les compétences
    skill_matrix = vectorizer.fit_transform([all_skills_text, offer_skills, cv_text])

    # Extraire le vecteur de l'offre
    offer_vector = skill_matrix[1]

    # Extraire le vecteur du profil
    cv_text_vector = skill_matrix[2]

    # Calculer la similarité cosinus entre les vecteurs de compétences
    similarity = cosine_similarity(offer_vector, cv_text_vector)

    return similarity[0][0]

def filter_matching_skills(cv_text, offre_skills):
    cv_words = cv_text.split()  # Divisez le texte du CV en mots individuels
    matching_skills = []

    for word in cv_words:
        if word in offre_skills:
            matching_skills.append(word)

    filtered_cv_text = ' '.join(matching_skills)  # Rejoignez les mots filtrés en un texte
    return filtered_cv_text



@csrf_exempt
def get_sorted_candidatures(request, offre_id):
    if request.method == 'GET':
        try:
            offre = Offre.objects.get(pk=offre_id)
            candidatures = Candidature.objects.filter(offre=offre)
            cv_texts = []

            # Compétences de l'offre
            offre_skills = offre.competences.lower()

            for candidature in candidatures:
                if candidature.candidat.resume:  # Vérifier si le candidat a un CV
                    cv_text = extract_text_from_pdf(candidature.candidat.resume.path)
                    filtered_cv_text = filter_matching_skills(cv_text.lower(), offre_skills)
                    cv_texts.append(filtered_cv_text)  # Ajoutez le texte filtré à la liste


            # Calculer la similarité cosinus entre les vecteurs de CVs extraits et les compétences de l'offre
            similarity_scores = [calculate_cosine_similarity__(offre_skills, cv) for cv in cv_texts]

            # Trier les candidatures en fonction de la similarité cosinus
            sorted_candidatures = sorted(zip(candidatures, similarity_scores), key=lambda x: x[1], reverse=True)

            # Retourner les candidatures triées avec toutes les informations et la similarité cosinus
            sorted_candidatures_data = []
            for candidature, score in sorted_candidatures:
                candidature_data = CandidatureDisplaySerializer(candidature).data
                candidature_data['score'] = score  # Ajouter la similarité cosinus
                sorted_candidatures_data.append(candidature_data)

            return JsonResponse({'sorted_candidatures': sorted_candidatures_data})
        except Offre.DoesNotExist:
            return JsonResponse({'error': 'Offre not found'})
    else:
        return JsonResponse({'error': 'Invalid request method'})





def recommend_offers_to_user(request, user_id):
    if request.method == 'GET':
        try:
            user = User.objects.get(pk=user_id)
            user_cv = extract_text_from_pdf(user.resume.path)

            offers = Offre.objects.all()
            recommended_offers = []

            for offre in offers:
                offer_skills = offre.competences.lower()
                filtered_user_cv = filter_matching_skills(user_cv.lower(), offer_skills)
                if filtered_user_cv:  # Vérifier si le texte filtré n'est pas vide
                    similarity = calculate_cosine_similarity__(offre.competences.lower(), filtered_user_cv)
                    if similarity != 0:
                        recommended_offers.append({'offer': offre, 'similarity': similarity})

            sorted_recommended_offers = sorted(recommended_offers, key=lambda x: x['similarity'], reverse=True)

            recommended_offers_data = []
            for recommended_offer in sorted_recommended_offers:
                offer_data = OffreSerializer(recommended_offer['offer']).data
                offer_data['similarity'] = recommended_offer['similarity']
                recommended_offers_data.append(offer_data)

            return JsonResponse({'recommended_offers': recommended_offers_data})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'})
    else:
        return JsonResponse({'error': 'Invalid request method'})





@csrf_exempt
def mes_candidatures(request, candidat_id):
    candidatures = Candidature.objects.filter(candidat__id=candidat_id)
    
    candidatures_data = []
    for candidature in candidatures:
        try:
            offre = candidature.offre
            candidatures_data.append({
                'offre_id': offre.id,
                'titre_du_poste': offre.titreDuPoste,
                'entreprise': offre.entreprise,
                'localisation': offre.localisation,
                'competences': offre.competences,
                'etat': candidature.etat,
            })
        except ObjectDoesNotExist:
            # Gérer le cas où l'offre n'existe pas
            pass
    
    return JsonResponse({'candidatures': candidatures_data})





from django.core.mail import send_mail
from django.conf import settings  # Importez les paramètres de votre fichier settings.py






from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

@api_view(['PUT'])
def updateCandidature(request, id=None):
    candidature = get_object_or_404(Candidature, id=id)
    serializer = CandidatureSerializer(instance=candidature, data=request.data)

    if serializer.is_valid():
        ancien_etat = candidature.etat
        serializer.save()

        # Si le nouvel état est "Acceptée" ou "Refusée" et l'ancien état était "En attente"
        if candidature.etat in ['Acceptée', 'Rejetée'] and ancien_etat == 'En attente':
            envoyer_email(candidature.candidat, candidature)  # Passer l'objet User et la candidature

            return Response({'message': f'État de candidature mis à jour et e-mail envoyé à {candidature.candidat.email}.'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'État de candidature mis à jour, mais aucun e-mail envoyé.'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def envoyer_email(user, candidature):
    subject = 'Etat de candidature'

    if candidature.etat == 'Acceptée':
        message = f"Cher(e) {user.first_name} {user.last_name},\n\nNous vous remercions vivement de l'intérêt que vous portez à notre offre pour le poste de '{candidature.offre.titreDuPoste}'. Après une évaluation attentive, nous tenons à vous informer que votre candidature a été {candidature.etat.lower()}.\n\nNous souhaitons vous informer que la date de l'entretien vous sera communiquée directement via notre application. Nous sommes ravis de poursuivre ce processus avec vous et vous souhaitons le meilleur dans vos recherches d'opportunités professionnelles.\n\nCordialement,\n"
    elif candidature.etat == 'Rejetée':
        message = f"Cher(e) {user.first_name} {user.last_name},\n\nNous vous remercions d'avoir pris le temps de postuler à notre offre pour le poste de '{candidature.offre.titreDuPoste}'. Après une évaluation minutieuse, nous regrettons de vous informer que votre candidature a été {candidature.etat.lower()}.\n\nNous apprécions votre intérêt pour notre entreprise et vous souhaitons succès dans vos futures opportunités professionnelles.\n\nCordialement,\n"

    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]
        
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)


@csrf_exempt
def changer_etat_candidature(request, candidature_id, nouvel_etat):
    candidature = get_object_or_404(Candidature, id=candidature_id)

    if nouvel_etat in ['Acceptée', 'Rejetée'] and candidature.etat == 'En attente':
        candidature.etat = nouvel_etat
        candidature.save()
        envoyer_email(candidature.candidat, candidature)  # Passer l'objet User et la candidature

        return JsonResponse({'message': f'État de candidature mis à jour et e-mail envoyé à {candidature.candidat.email}.'})
    else:
        return JsonResponse({'message': 'Impossible de mettre à jour l\'état de la candidature ou d\'envoyer un e-mail.'})
    





from operator import itemgetter
def like_similarity(text1, text2):
    count_vectorizer = CountVectorizer()
    count_matrix = count_vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(count_matrix[0], count_matrix[1])
    return similarity[0][0]



"""#Recommandation des offres 
@csrf_exempt
def combine_and_sort_scores(request, user_id):
    # Get the IDs of offers that the user has liked
    user = get_object_or_404(User, id=user_id)
    user_cv = extract_text_from_pdf(user.resume.path)

    liked_offers_ids = Like.objects.filter(user=user).values_list('offre_id', flat=True)

    # Get all offers
    all_offers = Offre.objects.all()
    recommended_offers = []
    for offre in all_offers:
        offer_skills = offre.competences.lower()
        filtered_user_cv = filter_matching_skills(user_cv.lower(), offer_skills)
        if filtered_user_cv:
            similarity = calculate_cosine_similarity__(offre.competences.lower(), filtered_user_cv)
            if similarity != 0:
                recommended_offers.append({'offer': OffreSerializer(offre).data, 'similarity': similarity})

    # Filter liked offers and non-liked offers
    liked_offers = [offer for offer in all_offers if offer.id in liked_offers_ids]
    non_liked_offers = [offer for offer in all_offers if offer.id not in liked_offers_ids]

    # Serialize the sorted offers and their similarity scores for JSON response
    serialized_offers = []
    for non_liked_offer in non_liked_offers:
        similarity_scores = []
        for liked_offer in liked_offers:
            similarity_score = like_similarity(liked_offer.competences, non_liked_offer.competences)
            similarity_scores.append(similarity_score)

        average_similarity = sum(similarity_scores) / len(similarity_scores)
        if average_similarity != 0:
            # Serialize the non-liked offer using the OffreSerializer
            serialized_offer = OffreSerializer(non_liked_offer).data
            serialized_offer['similarity'] = average_similarity

            serialized_offers.append(serialized_offer)
    
    # Combine recommended_offers and serialized_offers
    combined_offers = recommended_offers + serialized_offers
    # Combine and sort the offers based on similarity scores
    sorted_offers = sorted(combined_offers, key=itemgetter('similarity'), reverse=True)

    # Return a Response instance with the sorted offers
    return JsonResponse({'recommended_offers': sorted_offers})"""
#Recommandation des offres 
@csrf_exempt
def combine_and_sort_scores(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user_cv = extract_text_from_pdf(user.resume.path)
    liked_offers_ids = Like.objects.filter(user=user).values_list('offre_id', flat=True)
    all_offers = Offre.objects.all()
    
    recommended_offers = []
    for offre in all_offers:
        offer_skills = offre.competences.lower()
        filtered_user_cv = filter_matching_skills(user_cv.lower(), offer_skills)
        if filtered_user_cv:
            similarity = calculate_cosine_similarity__(offre.competences.lower(), filtered_user_cv)
            if similarity != 0:
                recommended_offers.append({'offer': {'id': offre.id, 'titreDuPoste': offre.titreDuPoste, 'localisation': offre.localisation, 'entreprise': offre.entreprise, 'competences': offre.competences}, 'similarity': similarity})

    liked_offers = [offer for offer in all_offers if offer.id in liked_offers_ids]
    non_liked_offers = [offer for offer in all_offers if offer.id not in liked_offers_ids]

    serialized_offers = []
    for non_liked_offer in non_liked_offers:
        similarity_scores = []
        for liked_offer in liked_offers:
            similarity_score = like_similarity(liked_offer.competences, non_liked_offer.competences)
            similarity_scores.append(similarity_score)
        if len(similarity_scores) > 0:
            average_similarity = sum(similarity_scores) / len(similarity_scores)
            serialized_offer = {'offer': {'id': non_liked_offer.id, 'titreDuPoste': non_liked_offer.titreDuPoste, 'localisation': non_liked_offer.localisation, 'entreprise': non_liked_offer.entreprise, 'competences': non_liked_offer.competences}, 'similarity': average_similarity}
            serialized_offers.append(serialized_offer)
    
    combined_offers = recommended_offers + serialized_offers
    
    max_similarity_offers = {}
    for offer in combined_offers:
        offer_data = offer['offer']
        offer_id = offer_data['id']
        similarity = offer['similarity']
        
        if offer_id in max_similarity_offers:
            if similarity > max_similarity_offers[offer_id]['similarity']:
                max_similarity_offers[offer_id] = {'offer': offer_data, 'similarity': similarity}
        else:
            max_similarity_offers[offer_id] = {'offer': offer_data, 'similarity': similarity}

    unique_max_similarity_offers = list(max_similarity_offers.values())
    
    sorted_unique_max_similarity_offers = sorted(unique_max_similarity_offers, key=itemgetter('similarity'), reverse=True)
    
    return JsonResponse({'recommended_offers': sorted_unique_max_similarity_offers})





from django.db.models import Count

def candidature_summary_view(request, offer_id):
    candidatures = Candidature.objects.filter(offre_id=offer_id)
    summary = candidatures.values('etat').annotate(count=Count('id'))
    
    response_data = {
        'candidature_summary': list(summary)
    }
    return JsonResponse(response_data)

def likes_histogram_view(request, offre_id):
    likes_data = Like.objects.filter(offre_id=offre_id).values('created_at').annotate(count=Count('id'))
    
    if not likes_data:
        return JsonResponse([], safe=False)  # Return an empty JSON response
    
    serialized_data = [{'date': entry['created_at'], 'count': entry['count']} for entry in likes_data]
    return JsonResponse(serialized_data, safe=False)


@api_view(['GET'])
def candidatures_by_day(request, offre_id):
    candidatures = Candidature.objects.filter(offre_id=offre_id).values('created_at')
    
    # Manually group candidatures by day, month, and year
    grouped_candidatures = {}
    for candidature in candidatures:
        day = candidature['created_at'].date().strftime('%Y-%m-%d')  # Format the date as "year-month-day"
        if day not in grouped_candidatures:
            grouped_candidatures[day] = 0
        grouped_candidatures[day] += 1
    
    data = [{'date': day, 'candidature_count': count} for day, count in grouped_candidatures.items()]
    return Response(data)


def CandidatureCountView(request, offre_id):
        candidature_count = Candidature.objects.filter(offre_id=offre_id).count()
        return JsonResponse({'count': candidature_count})

def LikeCountView(request, offre_id):
        like_count = Like.objects.filter(offre_id=offre_id).count()
        return JsonResponse({'count': like_count})

def EntretienCountView(request, offre_id):
        candidatures = Candidature.objects.filter(offre_id=offre_id)
        candidature_ids = [candidature.id for candidature in candidatures]
        entretien_count = Entretien.objects.filter(candidature__id__in=candidature_ids).count()
        return JsonResponse({'count': entretien_count})




def nombre_candidatures_acceptees(request, offre_id):
    try:
        candidatures_acceptees = Candidature.objects.filter(offre_id=offre_id, etat='Acceptée')
        nombre_candidatures_acceptees = candidatures_acceptees.count()

        data = {'nombre_candidatures_acceptees': nombre_candidatures_acceptees}
        return JsonResponse(data)
    except Candidature.DoesNotExist:
        return JsonResponse({'error': 'Candidatures not found'}, status=404)


def nombre_candidatures_rejetees(request, offre_id):
    try:
        candidatures_rejetees = Candidature.objects.filter(offre_id=offre_id, etat='Rejetée')
        nombre_candidatures_rejetees = candidatures_rejetees.count()

        data = {'nombre_candidatures_rejetees': nombre_candidatures_rejetees}
        return JsonResponse(data)
    except Candidature.DoesNotExist:
        return JsonResponse({'error': 'Candidatures not found'}, status=404)
    

def nombre_candidatures_en_attente(request, offre_id):
    try:
        candidatures_en_attente = Candidature.objects.filter(offre_id=offre_id, etat='En attente')
        nombre_candidatures_en_attente = candidatures_en_attente.count()

        data = {'nombre_candidatures_en_attente': nombre_candidatures_en_attente}
        return JsonResponse(data)
    except Candidature.DoesNotExist:
        return JsonResponse({'error': 'Candidatures not found'}, status=404)

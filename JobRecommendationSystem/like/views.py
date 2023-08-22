from offre.models import Offre
from like.models import Like
from account.models import User
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def like_offre(request, offre_id):
    if request.method == 'POST':
        user_id = request.data.get('userId')
        user = User.objects.get(id=user_id)
        offre = Offre.objects.get(id=offre_id)
        
        # Check if the user has already liked the offre
        like, created = Like.objects.get_or_create(user=user, offre=offre)
        
        if not created:
            like.delete()
        
        return Response({'message': 'Like updated successfully.'})
@api_view(['GET'])
def get_like_status(request, offre_id):
    if request.method == 'GET':
        user_id = request.GET.get('userId')
        user = User.objects.get(id=user_id)
        offre = Offre.objects.get(id=offre_id)
        
        try:
            like = Like.objects.get(user=user, offre=offre)
            liked = True
        except Like.DoesNotExist:
            liked = False
        
        return Response({'liked': liked})


from django.http import JsonResponse
from sklearn.metrics.pairwise import cosine_similarity
from django.shortcuts import get_object_or_404
from sklearn.feature_extraction.text import CountVectorizer


def calculate_similarity(text1, text2):
    count_vectorizer = CountVectorizer()
    count_matrix = count_vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(count_matrix[0], count_matrix[1])
    return similarity[0][0]

def get_best_offers(request, user_id):
    # Get the IDs of offers that the user has liked
    user = get_object_or_404(User, id=user_id)
    liked_offers_ids = Like.objects.filter(user=user).values_list('offre_id', flat=True)

    # Get all offers
    all_offers = Offre.objects.all()

    # Filter liked offers and non-liked offers
    liked_offers = [offer for offer in all_offers if offer.id in liked_offers_ids]
    non_liked_offers = [offer for offer in all_offers if offer.id not in liked_offers_ids]

    # Serialize the sorted offers and their similarity scores for JSON response
    serialized_offers = []
    for non_liked_offer in non_liked_offers:
        similarity_scores = []
        for liked_offer in liked_offers:
            similarity_score = calculate_similarity(liked_offer.competences, non_liked_offer.competences)
            similarity_scores.append(similarity_score)
        
        average_similarity = sum(similarity_scores) / len(similarity_scores)
        
        serialized_offer = {
            'id': non_liked_offer.id,
            'titreDuPoste': non_liked_offer.titreDuPoste,
            'competences': non_liked_offer.competences,
            'description': non_liked_offer.description,
            'localisation':non_liked_offer.localisation,
            'entreprise':non_liked_offer.entreprise,
            'similarity_score': average_similarity,
            # Include other offer attributes you want to display
        }
        serialized_offers.append(serialized_offer)

    sorted_offers = sorted(serialized_offers, key=lambda x: x['similarity_score'], reverse=True)

    return JsonResponse(sorted_offers, safe=False)

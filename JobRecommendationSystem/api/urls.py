from django.urls import path
from .views import *
from .views import LinkedInAuthView

urlpatterns = [
    path('getEntretiens/', getEntretiens),
    path('add/', addEntretien),
    path('updateEntretien/<int:id>/', updateEntretien),
    path('delete/<int:id>', deleteEntretien),
    path('register/', register_api),
    path('login/', LoginAPIView.as_view(), name='post'),
    path('user/<int:id>/update/', updateUser),
    path('linkedin-auth/', LinkedInAuthView.as_view(), name='get'),
    path('logout/', logout_view, name='logout'),
    path('candidature/add/', addCandidature),
    path('addOffre/', addOffre),
    path('updateOffre/<int:id>/', updateOffre),
    path('getoffres/',getOffres),
    path('getOffreByID/<int:offre_id>/', GetOffreByID.as_view(), name='get-offre-by-id'),
    path('offres/coordinator/<int:coordinator_id>/', getOffresByCoordinator),
    path('candidatures/offre/<int:offre_id>/', get_candidatures_by_offre),
    path('login_to_linkedin/',login_to_linkedin),
    path('profiles_recommendations/<int:offer_id>/', get_offer_recommendations, name='profiles_recommendations'),
    path('get_sorted_candidatures/<int:offre_id>/', get_sorted_candidatures),
    path('recommend_offers_to_user/<int:user_id>/', recommend_offers_to_user),
    path('updateCandidature/<int:id>/', updateCandidature),
    path('getCandidatureByID/<int:candidature_id>/', GetCandidatureByID.as_view(), name='get-candidature-by-id'),
    path('mesCandidatures/<int:candidat_id>/', mes_candidatures),
    path('entretien/add/', addEntretien),
    path('getEntretiensByCoordinateur/<int:coordinator_id>/', getEntretiensByCoordinateur),
    path('getEntretiensByCandidat/<int:candidat_id>/', getEntretiensByCandidat),
    path('getEntretienByID/<int:entretien_id>/', GetEntretienByID.as_view(), name='get-entretien-by-id'),
    path('getUserByID/<int:user_id>/', GetUserByID.as_view(), name='get-user-by-id'),
    

]
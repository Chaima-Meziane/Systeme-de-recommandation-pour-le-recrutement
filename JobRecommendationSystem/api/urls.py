from django.urls import path
from .views import *
from .views import LinkedInAuthView

urlpatterns = [
    path('', getEntretiens),
    path('add/', addEntretien),
    path('update/<int:id>', updateEntretien),
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

]
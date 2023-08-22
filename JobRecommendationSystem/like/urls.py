# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('like_offre/<int:offre_id>/', views.like_offre, name='like-offre'),
    path('best_offers/<int:user_id>/', views.get_best_offers),
]

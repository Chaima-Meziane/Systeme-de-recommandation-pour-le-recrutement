from django.urls import path, include
from rest_framework import routers
from offre.views import OffreViewSet
router= routers.DefaultRouter()
router.register(r'offre', OffreViewSet)

urlpatterns = [
    path('', include(router.urls)),

]
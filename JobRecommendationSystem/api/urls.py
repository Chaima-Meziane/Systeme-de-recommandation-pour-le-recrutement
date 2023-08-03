from django.urls import path
from .views import *

urlpatterns = [
    path('', getEntretiens),
    path('add/', addEntretien),
    path('update/<int:id>', updateEntretien),
    path('delete/<int:id>', deleteEntretien),
    path('register/', register_api),
    path('login/', LoginAPIView.as_view(), name='post'),
    path('user/<int:id>/update/', updateUser),

   

]
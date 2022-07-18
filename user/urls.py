from django.urls import path
from .views import MakeAccount, Login, LogOut, UploadProfile

urlpatterns = [
    path('makeAccount', MakeAccount.as_view()),
    path('login', Login.as_view()),
    path('logout', LogOut.as_view()),
    path('profile/upload', UploadProfile.as_view())

]
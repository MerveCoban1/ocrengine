from os import name
from . import views
from django.urls import path

urlpatterns = [
    path('', views.home, name="home"),
    path("upload_file", views.upload_file, name="upload_file"),
    path("ocr", views.ocr, name="ocr")

]

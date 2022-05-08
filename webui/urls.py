from os import name
from . import views
from django.urls import path

urlpatterns = [
    path('', views.home, name="home"),
    path("upload_file", views.upload_file, name="upload_file"),
    path("ocr", views.ocr, name="ocr"),
    path("getOcrResult",views.getOcrResult, name="getOcrResult"),
    path("ocr_page",views.ocr_page, name="ocr_page"),
    path("cropLines",views.cropLines, name="cropLines"),
]

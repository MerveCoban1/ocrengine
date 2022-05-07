from django.http import JsonResponse
from django.shortcuts import render

from webui.models import Image
import cv2
import tensorflow as tf
import numpy as np

import json
import requests
# Create your views here.

def home(request):
    template_name = "index.html"
    return render(request, template_name)


def upload_file(request):
    template_name = "index.html"
    context = dict()
    if request.method == 'POST' and request.FILES['file']:
        image = Image(Image=request.FILES['file'])
        image.save()
        print("image url:")
        print(image.Image.url)
        font_prediction(image.Image.url)
        context["imageurl"] = image.Image.url
        context["imageid"] = image.imageid

    return render(request, template_name, context=context)


def ocr(request):
    print("ocr metoduna geldik")
    context = {"success": False}
    try:
        imageid = request.POST["imageid"]
        version = request.POST["version"]
    
        coords_font = request.POST["coords_font"]
        coords_x = request.POST["coords_x"]
        coords_y = request.POST["coords_y"]
        coords_w = request.POST["coords_w"]
        coords_h = request.POST["coords_h"]


        image = Image.objects.filter(imageid=imageid).get()
        path = image.Image.url[1:]

        #resmi gelen koordinatlara göre kırpalım
        img = cv2.imread(path)
        print("kırpma işlemini yapalım")
        
        print(coords_x,coords_y,coords_w,coords_h)

        yh= int(coords_y)+int(coords_h)
        xw= int(coords_x)+int(coords_w)
        
        cropped_img=img[int(coords_y):yh, int(coords_x):xw]
        print(cropped_img)
        print("kırpılmış resmi kaydedelim")
        cv2.imwrite("./media/images/cropped_image.png", cropped_img)
        print("kayıt gerçekleşti")

        #upload-image isteği yapılacak







        ################take token


        user_data = {
            'username': 'test1234',
            'password': 'test1234',
        }

        token_url = "https://www.osmanlica.com/api/token/"

        r = requests.post(token_url, user_data)
       
        resp_dict = json.loads(r.text)
        access_token = resp_dict['access']

        print("TOKEN ", access_token)


         ################make ocr with access token

        image_url = "http://www.mervecoban.me/images/cropped/image.jpg"  # give exact path of image when hosted

        ocr_data = {
            'username': 'test1234',
        }
        ocr_data['image_url'] = image_url

        ocr_headers = {
            'Content-Type': 'application/json',
        }
        ocr_headers['Authorization'] = "Bearer " + access_token

        ocr_url = "https://www.osmanlica.com/api/image_line"

        r = requests.post(ocr_url, json = ocr_data, headers = ocr_headers)

        resp_dict = json.loads(r.text)
        image_detail = resp_dict['image_detail']
        print("image_detail OCR RESULT ", image_detail)

        context["text"] =  str(image_detail)
        context["success"] = True

    except requests.exceptions.HTTPError as e:
        context["message"] = "What went wrong is ", str(e)

    return JsonResponse(context, safe=False)

def font_prediction(img_url):
    
    img_url = '.'+img_url

    img_height = 180
    img_width = 180
    class_names = ['diger', 'nesih']

    modelim = tf.keras.models.load_model("img_classification_model")

    img = tf.keras.utils.load_img(
        img_url, target_size=(img_height, img_width)
    )
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create a batch

    predictions = modelim.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    print("prediction:")
    print("This image {} most likely belongs to {} with a {:.2f} percent confidence.".format(img_url,class_names[np.argmax(score)], 100 * np.max(score)))
    print("prediction bitti...")
   
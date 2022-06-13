from itertools import count
from django.http import JsonResponse
from django.shortcuts import render, redirect

from webui.models import Image
import cv2
import tensorflow as tf
import numpy as np

import json
import requests
import os
# Create your views here.

coords_x =0
coords_y = 0
coords_w =0
coords_h = 0
yh=0
xw=0

def home(request):
    template_name = "index.html"
    return render(request, template_name)


def upload_file(request):
    template_name = "index.html"
    context = dict()
    if request.method == 'POST' and request.FILES['file']:
        image = Image(Image=request.FILES['file'])
        image.save()
        os.remove("./static/json/imgUrl.json")
        print("image url:")
        print(image.Image.url)
        with open('./static/json/imgUrl.json', 'w') as json_dosya:
            json.dump(image.Image.url, json_dosya)
        
        context["imageurl"] = image.Image.url
        context["imageid"] = image.imageid

    return render(request, template_name, context=context)


def ocr(request):
    print("ocr metoduna geldik")
    context = {"success": False}
    try:

        if request.POST:
            imageid = request.POST.get("imageid", "")
            print("PATHHHHHHHHHHHHHHHHHHHHHHHH", str(imageid))
            version = request.POST.get("version", "")
        
            coords_font = request.POST.get("coords_font", "diger")
            coords_x = request.POST.get("coords_x", "0")
            coords_y = request.POST.get("coords_y", "0")
            coords_w = request.POST.get("coords_w", "0")
            coords_h = request.POST.get("coords_h", "0")

            request.session['coords_w'] = str(coords_w)
            request.session['coords_h'] = str(coords_h)
            request.session['coords_x'] = str(coords_x)
            request.session['coords_y'] = str(coords_y)

            image = Image.objects.filter(imageid=imageid).get()
            path = image.Image.url[1:]
        
            #resmi gelen koordinatlara göre kırpalım
            img = cv2.imread(path)
            
            print("COORDINATES ", coords_x,coords_y,coords_w,coords_h)

            yh= int(coords_y)+int(coords_h)
            xw= int(coords_x)+int(coords_w)
            
            cropped_img=img[int(coords_y):yh, int(coords_x):xw]
            print(cropped_img)

            cv2.imwrite("./media/images/cropped_image.png", cropped_img)

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

        #save detail to json file
        with open('./static/json/OCRResult.json', 'w') as json_dosya:
            json.dump(image_detail, json_dosya)

        context["text"] =  str(image_detail)
        context["success"] = True

    except requests.exceptions.HTTPError as e:
        context["message"] = "What went wrong is ", str(e)

    template_name = "ocr_page.html"
    return render(request, template_name, context=context)


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
    
   
    fontPredictionResult=class_names[np.argmax(score)]
    return fontPredictionResult
    
   

def ocr_page(request):
    template_name = "ocr_page.html"
    return render(request, template_name)


def getOcrResult(request):
    with open('./static/json/OCRResult.json') as f:
        jsonData = json.load(f)
    print(jsonData)

    with open('./static/json/imgUrl.json') as f:
        imagePath=json.load(f)
    
    predictionResult=font_prediction(imagePath)

    context = {"success": True}
    context["text"] =  jsonData
    context["fontText"] =  predictionResult
    return JsonResponse(context, safe=False)


def cropLines(request):

    import os
    import shutil
    context = {"success": False}
    try:

        if request.POST:
            coords_x = request.session.get('coords_x')
            print("coords_x"+ str(coords_x))
            coords_y = request.session.get('coords_y')
            print("coords_y"+ str(coords_y))
            coords_h = request.session.get('coords_h')
            print("coords_h"+ str(coords_h))
            coords_w = request.session.get('coords_w')
            print("coords_w"+ str(coords_w))
            
            coordinates = request.POST.getlist('coordinates[]')
            width = request.POST.get('width',"")
            print("croplines a gelen koordinatlar:")
            print(coordinates)
            print(width)
            
            #os.makedirs("./media/images/cropped", exist_ok=True)
            ##klasörü temizleyelim
            #shutil.rmtree("./media/images/cropped")
    
            yh= int(coords_y)+int(coords_h)
            xw= int(coords_x)+int(coords_w)
            print(  "XH"+ str(xw) +"........."+str(yh))
            ##dolduralım
            img = cv2.imread("./media/images/cropped_image.png")
            print("imageeeeeeeeee")
            print(img)
            counter=1
            for sayi in range(0,len(coordinates),2):
                print("IN coordinates FOR ")
                height=int(coordinates[sayi+1])-int(coordinates[sayi])
               

                #yüksekliğin nerden başladığı ve yüksekliği
                
                cropped_img=img[int(coordinates[sayi]):(height+int(coordinates[sayi])), 0:int(width)]
                
                coords_y = int(coords_y) +  int(height)
                filename = "./media/images/cropped/crop"+str(counter)+".png"
                cv2.imwrite(filename, cropped_img)
                counter+=1
               
    
            yh= int(coords_y)+int(coords_h)
            xw= int(coords_x)+int(coords_w)
            print(  "XH"+ str(xw) +"........."+ str(yh))
        
            context["text"] =  "huj"
            context["success"] = True
    except requests.exceptions.HTTPError as e:
        context["message"] = "What went wrong is ", str(e)

    return JsonResponse(context, safe=False)
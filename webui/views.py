from sys import version
from traceback import print_tb
from django.http import JsonResponse
from django.shortcuts import render

from webui.models import Image

import pytesseract as tess
tess.pytesseract.tesseract_cmd = r'C:\Users\coban\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

from pytesseract import image_to_string

import cv2
import imutils
from imutils.perspective import four_point_transform

from requests import options
import tensorflow as tf
import numpy as np

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


def improve(imageurl, lang):
    # Source CODE
    "https://www.pyimagesearch.com/2021/10/27/automatically-ocring-receipts-and-scans/"
    orig = cv2.imread(imageurl)
    image = orig.copy()
    image = imutils.resize(image, width=500)
    ratio = orig.shape[1] / float(image.shape[1])

    # convert the image to grayscale, blur it slightly, and then apply
    # edge detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5,), 0)
    edged = cv2.Canny(blurred, 75, 200)
    # check to see if we should show the output of our edge detection
    # procedure

    # find contours in the edge map and sort them by size in descending
    # order
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

    # initialize a contour that corresponds to the receipt outline
    receiptCnt = None
    # loop over the contours
    for c in cnts:
        # approximate the contour
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        # if our approximated contour has four points, then we can
        # assume we have found the outline of the receipt
        if len(approx) == 4:
            receiptCnt = approx
            break
    # if the receipt contour is empty then our script could not find the
    # outline and we should be notified
    if receiptCnt is None:
        raise Exception(("Could not find receipt outline. "
                         "Try debugging your edge detection and contour steps."))

    output = image.copy()

    cv2.drawContours(output, [receiptCnt], -1, (0, 255, 0), 2)

    # apply a four-point perspective transform to the *original* image to
    # obtain a top-down bird's-eye view of the receipt
    receipt = four_point_transform(orig, receiptCnt.reshape(4, 2) * ratio)

    # apply OCR to the receipt image by assuming column data, ensuring
    # the text is *concatenated across the row* (additionally, for your
    # own images you may need to apply additional processing to cleanup
    # the image, including resizing, thresholding, etc.)
    options = "--psm 4"
    text = image_to_string(cv2.cvtColor(
        receipt, cv2.COLOR_BGR2RGB), lang=lang,  config=options)

    return text


def ocr(request):
    context = {"success": False}
    try:
        imageid = request.POST["imageid"]
        version = request.POST["version"]
        image = Image.objects.filter(imageid=imageid).get()
        path = image.Image.url[1:]
        #result = improve(path, version)

        img = cv2.imread(path)
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        ret2, th2 = cv2.threshold(
            gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        img = cv2.fastNlMeansDenoising(th2, 10, 10, 7)
        result = image_to_string(img, lang=version)
        context["text"] = result
        context["success"] = True
    except Exception as identifier:
        context["message"] = "ERROR"

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
   
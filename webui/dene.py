import os
from pathlib import Path
from requests import options
import tensorflow as tf
import numpy as np

img_height = 180
img_width = 180
class_names = ['diger', 'nesih']
print("1.geliş")

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = [os.path.join(BASE_DIR, 'img_classification_model')]

modelim = tf.keras.models.load_model("img_classification_model")


#print("2.geliş")
#img = tf.keras.utils.load_img(
#    'test.png', target_size=(img_height, img_width)
#)
#img_array = tf.keras.utils.img_to_array(img)
#img_array = tf.expand_dims(img_array, 0) # Create a batch
#
#predictions = modelim.predict(img_array)
#print("tahmin:")
#print(predictions)



directoryLabel="C:/Users/coban/OneDrive/Masaüstü/Tensorflow/Tensorflow-main/imageClassification/test/"
os.chdir(directoryLabel)
testLabels=os.listdir()
for label in testLabels:
    directoryData="C:/Users/coban/OneDrive/Masaüstü/Tensorflow/Tensorflow-main/imageClassification/test/"+label+"/"
    accuracyCount=0
    dataCount=0
    os.chdir(directoryData)
    testData=os.listdir()
    for data in testData:
        dataCount=dataCount+1
   
        img = tf.keras.utils.load_img(
            data, target_size=(img_height, img_width)
        )
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # Create a batch
    
        predictions = modelim.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        if class_names[np.argmax(score)]==label:
            accuracyCount=accuracyCount+1
        #print("This image {} most likely belongs to {} with a {:.2f} percent confidence.".format(data,class_names[np.argmax(score)], 100 * np.max(score)))
        
    print("{} türünden {} tane veriden {} tanesi doğru tahmin edildi ".format(label,dataCount,accuracyCount))
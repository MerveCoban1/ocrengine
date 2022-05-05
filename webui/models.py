import os
from django.db import models

# Create your models here.
import uuid

def content_single_image_name(instance, filename):
    ext = os.path.basename(filename)
    ext = os.path.splitext(ext)[1]
    # now = datetime.datetime().now
    filename = f"{str(uuid.uuid4())}{ext}"
    return os.path.join('images',filename)

class Image(models.Model):
    Image = models.FileField(
        upload_to=content_single_image_name, null=True, blank=True)
    imageid = models.CharField(max_length=64, blank=True, default=uuid.uuid4)
    created = models.DateTimeField(auto_now_add=True)


from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Note(models.Model):
    user_input = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notes")

    result = models.JSONField(default=list)

    def __str__(self):
        return self.user_input

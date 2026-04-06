from django.db import models
from django.conf import settings


class Task(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks")
    status = models.CharField(max_length=20, default="pending")

    def __str__(self):
        return self.title

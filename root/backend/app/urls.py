from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.SentimentAnalysisPrompt.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/",
         views.SentimentAnalysisPromptDelete.as_view(), name="delete-note"),
]

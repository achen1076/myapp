from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 
                  'password']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



class SentimentAnalysisSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ["id", "user_input", "created_at", "author", "result"]
        extra_kwargs = {"author": {"read_only": True}}
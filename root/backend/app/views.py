import base64
from prophet.serialize import model_to_json
import prophet as Prophet
import requests
from datetime import date
import pandas as pd
import matplotlib.pyplot as plt
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
import openai
import yfinance as yf
from .models import *
from .serializer import *
import matplotlib
matplotlib.use('Agg')

client = openai.OpenAI()


class UserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class SentimentAnalysisPrompt(generics.ListCreateAPIView):
    serializer_class = SentimentAnalysisSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()

    def create_model(self, data):
        model = Prophet.Prophet(
            changepoint_prior_scale=0.05,
            holidays_prior_scale=15,
            seasonality_prior_scale=10,
            weekly_seasonality=True,
            yearly_seasonality=True,
            daily_seasonality=False
        )
        model.add_country_holidays(country_name='US')
        model.fit(data)
        return model

    def generate_forecast(self, model, periods=365):
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        return forecast

    def process_data(self, data):
        stock_data = pd.DataFrame(yf.download(
            data, start="1920-01-01", end=date.today()))
        stock_data.reset_index(inplace=True)
        stock_data.rename(
            columns={'Date': 'ds', 'Adj Close': 'y'}, inplace=True)
        model = self.create_model(stock_data)
        forcast = self.generate_forecast(model)
        return model, forcast

    def get_queryset(self):
        user = self.request.user
        user_notes = Note.objects.filter(author=user)

        ticker = user_notes[0].user_input
        model, forcast = self.process_data(ticker)

        with open('data/serialized_model.json', 'w') as fout:
            fout.write(model_to_json(model))  # Save model

        model.plot(forcast).savefig(
            "data/chart.svg")

        return user_notes

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class SentimentAnalysisPromptDelete(generics.DestroyAPIView):
    serializer_class = SentimentAnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

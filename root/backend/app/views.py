
import json
from keras import Sequential, layers
from sklearn.preprocessing import MinMaxScaler
import numpy as np
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

    def fetch_stock_data(self, ticker, start_date, end_date):
        stock_data = yf.download(ticker, start=start_date, end=end_date)
        return stock_data

    def create_sequences(self, data, seq_length):
        xs, ys = [], []
        for i in range(len(data)-seq_length-1):
            x = data[i:(i+seq_length), 0]
            y = data[i + seq_length, 0]
            xs.append(x)
            ys.append(y)
        return np.array(xs), np.array(ys)

    def get_queryset(self):
        user = self.request.user
        user_notes = Note.objects.filter(author=user)

        if user_notes.exists():
            ticker = user_notes[0].user_input
        else:
            # Handle case where no Notes are found for the user
            ticker = None  # or some default value

        start_date = '2020-01-01'
        end_date = date.today()
        # Fetch the stock data
        if ticker:
            stock_df = self.fetch_stock_data(ticker, start_date, end_date)
            data = stock_df[['Close']].values

            # Scale the data
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled_data = scaler.fit_transform(data)

            # Create sequences of historical data with a sequence length of 30 days
            seq_length = 30
            X, y = self.create_sequences(scaled_data, seq_length)

            # Reshape X to fit LSTM input shape (samples, time steps, features)
            X = np.reshape(X, (X.shape[0], X.shape[1], 1))

            # Define the LSTM model
            model = Sequential()
            model.add(layers.LSTM(units=50, return_sequences=True))
            model.add(layers.Dropout(0.2))
            model.add(layers.LSTM(units=50, return_sequences=False))
            model.add(layers.Dropout(0.2))
            model.add(layers.Dense(units=1))

            # Compile the model
            model.compile(optimizer='adam', loss='mean_squared_error')

            # Fit the model to the training data
            model.fit(X, y, epochs=10, batch_size=32)

            # Predicting future stock prices
            last_sequence = scaled_data[-seq_length:, 0]
            last_sequence = np.reshape(last_sequence, (1, seq_length, 1))
            predicted_price = model.predict(last_sequence)
            predicted_price = scaler.inverse_transform(predicted_price)

            last_sequence = scaled_data[-seq_length:, 0]
            predicted_prices = []

            for _ in range(90):
                last_sequence = np.reshape(last_sequence, (1, seq_length, 1))
                next_day_prediction = model.predict(last_sequence)
                # Predicting only the last day of the sequence
                predicted_prices.append(next_day_prediction[0][-1])
                last_sequence = np.append(last_sequence[:, 1:, :], np.reshape(
                    next_day_prediction, (1, 1, 1)), axis=1)

            # Inverse transform the predicted prices to get actual prices
            predicted_prices = np.array(predicted_prices)
            predicted_prices = np.reshape(
                predicted_prices, (predicted_prices.shape[0], 1))
            predicted_prices = scaler.inverse_transform(predicted_prices)

            result = []

            for price in predicted_prices:
                result.append(str(price[0]))

            result = json.dumps(result)

            user_notes.update(result=result)
            return user_notes
        else:
            # Handle case where no `ticker` is available (optional)
            return []  # or some default response

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

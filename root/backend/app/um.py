import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras import Sequential, layers
from datetime import date

# Fetch historical data for a stock (e.g., Apple - AAPL)


def fetch_stock_data(ticker, start_date, end_date):
    stock_data = yf.download(ticker, start=start_date, end=end_date)
    return stock_data


# Define the ticker symbol and time period
ticker = 'lulu'
start_date = '2020-01-01'
end_date = date.today()

# Fetch the stock data
stock_df = fetch_stock_data(ticker, start_date, end_date)
data = stock_df[['Close']].values

# Scale the data
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

# Function to create sequences for LSTM


def create_sequences(data, seq_length):
    xs, ys = [], []
    for i in range(len(data)-seq_length-1):
        x = data[i:(i+seq_length), 0]
        y = data[i + seq_length, 0]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)


# Create sequences of historical data with a sequence length of 30 days
seq_length = 30
X, y = create_sequences(scaled_data, seq_length)

# Reshape X to fit LSTM input shape (samples, time steps, features)
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# Define the LSTM model
model = Sequential()
model.add(layers.LSTM(units=50, return_sequences=True,
                      ))
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
print(f"Predicted next day closing price: ${predicted_price[0][0]:.2f}")


last_sequence = scaled_data[-seq_length:, 0]
predicted_prices = []

# # Predicting for 90 days (3 months)
for _ in range(90):
    last_sequence = np.reshape(last_sequence, (1, seq_length, 1))
    next_day_prediction = model.predict(last_sequence)
    # Predicting only the last day of the sequence
    predicted_prices.append(next_day_prediction[0][-1])
    last_sequence = np.append(last_sequence[:, 1:, :], np.reshape(
        next_day_prediction, (1, 1, 1)), axis=1)

# Inverse transform the predicted prices to get actual prices
predicted_prices = np.array(predicted_prices)
predicted_prices = np.reshape(predicted_prices, (predicted_prices.shape[0], 1))
predicted_prices = scaler.inverse_transform(predicted_prices)
result = []

for price in predicted_prices:
    result.append(price[0])

print(result)

# # Print the predicted prices for the next 90 days
# for i, price in enumerate(predicted_prices):
#     print(f"Day {i+1}: Predicted Price: ${price[0]:.2f}")

print(f"Last recorded closing price: ${data[-1][0]:.2f}")

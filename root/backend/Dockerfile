# Use official Python image
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project code
COPY . .

# Expose port 8000
EXPOSE 8000

# Default command (will be overridden by docker-compose)
CMD ["gunicorn", "ai.wsgi:application", "--bind", "0.0.0.0:8000"]

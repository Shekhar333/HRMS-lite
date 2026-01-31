# Use official Python runtime as base image
FROM python:3.11.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY backend/requirements.txt .

# Install Python dependencies (use binary wheels when possible)
RUN pip install --upgrade pip setuptools wheel && \
    pip install --only-binary=:all: --prefer-binary -r requirements.txt || \
    pip install -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Run the application
CMD uvicorn app:app --host 0.0.0.0 --port $PORT

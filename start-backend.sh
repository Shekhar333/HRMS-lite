#!/bin/bash

# HRMS Lite - Start Backend Server
# Run this script from the project root directory

echo "🚀 Starting HRMS Lite Backend..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found!"
    echo "Please run ./setup.sh first or create backend/.env manually"
    exit 1
fi

# Check if MongoDB URL is set
if grep -q "your-username:your-password" backend/.env; then
    echo "⚠️  Warning: MongoDB credentials not configured!"
    echo "Please update backend/.env with your MongoDB Atlas connection string"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Start server
echo ""
echo "✅ Starting server on http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo ""
python app.py

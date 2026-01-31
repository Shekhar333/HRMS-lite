#!/bin/bash

# HRMS Lite - Start Frontend Server
# Run this script from the project root directory

echo "🚀 Starting HRMS Lite Frontend..."
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start dev server
echo ""
echo "✅ Starting frontend on http://localhost:5173"
echo ""
npm run dev

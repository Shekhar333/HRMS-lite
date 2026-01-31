#!/bin/bash

# HRMS Lite - Setup Script
# This script will help you set up MongoDB and environment variables

echo "🚀 HRMS Lite - Setup Wizard"
echo "=============================="
echo ""

# Check if .env exists
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env already exists"
else
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=hrms_lite
CORS_ORIGINS=http://localhost:5173
PORT=8000" > backend/.env
    echo "⚠️  Please edit backend/.env and add your MongoDB connection string"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Set up MongoDB Atlas (Free):"
echo "   - Visit: https://www.mongodb.com/cloud/atlas/register"
echo "   - Create free cluster (M0)"
echo "   - Get connection string"
echo "   - Update backend/.env with your MongoDB URL"
echo ""
echo "2. Start Backend:"
echo "   cd backend"
echo "   python3 app.py"
echo ""
echo "3. Start Frontend (in new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README.md (complete guide)"
echo "   - QUICKSTART.md (fast setup)"
echo "   - DEPLOYMENT.md (deployment guide)"
echo ""
echo "✨ Happy coding!"

#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

echo "Python version:"
python --version

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Build completed successfully!"

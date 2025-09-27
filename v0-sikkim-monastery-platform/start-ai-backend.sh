#!/bin/bash

echo "Starting Monastery360 AI Search Backend..."
echo ""
cd ai-search-backend
echo "Installing Python dependencies..."
pip install -r requirements.txt
echo ""
echo "Starting AI Search service on http://localhost:8007"
echo "Press Ctrl+C to stop the service"
echo ""
python main.py

#!/bin/bash

# SinggleBee Full-Stack Startup Script
# This script starts the backend, admin dashboard, and storefront concurrently

echo "🐝 Starting SinggleBee E-Commerce Platform..."
echo ""

# Check if node_modules exist, if not install dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install
    cd ..
fi

if [ ! -d "admin/node_modules" ]; then
    echo "📦 Installing admin dashboard dependencies..."
    cd admin && npm install
    cd ..
fi

# Check if database is set up
if [ ! -f "backend/prisma/dev.db" ] && [ ! -f "backend/.env" ]; then
    echo "⚙️  Setting up database..."
    cd backend
    npm run prisma:generate
    npm run prisma:migrate
    npm run prisma:seed
    cd ..
fi

echo ""
echo "🚀 Starting all services..."
echo ""
echo "   Backend API:    http://localhost:3000"
echo "   Admin Dashboard: http://localhost:5174"
echo "   Storefront:      http://localhost:5173"
echo ""
echo "   Admin Credentials:"
echo "   Email: admin@singglebee.com"
echo "   Password: Secure#DB_2026!Access"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start all services concurrently
# Using trap to clean up all processes on exit
trap "kill 0" EXIT

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start admin dashboard in background
cd admin && npm run dev &
ADMIN_PID=$!
cd ..

# Start storefront in background
npm run dev &
STOREFRONT_PID=$!

# Wait for all processes
wait $BACKEND_PID $ADMIN_PID $STOREFRONT_PID

#!/bin/bash

# SinggleBee E-Commerce Full-Stack Startup Script
# This script starts Backend, Admin Dashboard, and Storefront simultaneously

set -e

echo "🐝 SinggleBee E-Commerce Platform"
echo "=================================="
echo ""

# Check if node_modules exist in each directory
install_deps() {
    echo "📦 Checking dependencies..."
    
    if [ ! -d "node_modules" ]; then
        echo "   Installing root dependencies..."
        npm install
    fi
    
    if [ ! -d "backend/node_modules" ]; then
        echo "   Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    
    if [ ! -d "admin/node_modules" ]; then
        echo "   Installing admin dependencies..."
        cd admin && npm install && cd ..
    fi
    
    echo "✅ All dependencies installed"
}

# Setup database
setup_db() {
    echo ""
    echo "🗄️  Setting up database..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --skip-generate
    npx prisma db seed
    cd ..
    echo "✅ Database setup complete"
}

# Start all services
start_services() {
    echo ""
    echo "🚀 Starting all services..."
    echo ""
    echo "=================================="
    echo "📊 Services Running:"
    echo "   🔙 Backend API:    http://localhost:3000"
    echo "   👨‍💼 Admin Dashboard: http://localhost:5174"
    echo "   🛒 Storefront:      http://localhost:5173"
    echo ""
    echo "🔐 Admin Credentials:"
    echo "   Email:    admin@singglebee.com"
    echo "   Password: Secure#DB_2026!Access"
    echo "=================================="
    echo ""
    
    # Use concurrently to run all services
    npx concurrently --kill-others-on-fail \
        --names "BACKEND,ADMIN,STORE" \
        --prefix-colors "green,cyan,blue" \
        --prefix "[{name}]" \
        "cd backend && npm run dev" \
        "cd admin && npm run dev" \
        "npm run dev"
}

# Main execution
main() {
    case "${1:-full}" in
        "full")
            install_deps
            setup_db
            start_services
            ;;
        "start")
            start_services
            ;;
        "deps")
            install_deps
            ;;
        "db")
            setup_db
            ;;
        *)
            echo "Usage: $0 [full|start|deps|db]"
            echo "  full  - Install deps, setup DB, and start all (default)"
            echo "  start - Start all services (assumes deps and DB are ready)"
            echo "  deps  - Install all dependencies only"
            echo "  db    - Setup database only"
            exit 1
            ;;
    esac
}

main "$@"

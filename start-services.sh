#!/bin/bash

# FoodHub Microservices Startup Script for Linux/macOS
# This script starts all backend services

echo "=========================================="
echo "FoodHub - Starting All Services"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
    return $?
}

# Check if MongoDB is running
echo "Checking MongoDB..."
if check_port 27017; then
    echo -e "${GREEN}MongoDB is running!${NC}"
else
    echo -e "${RED}WARNING: MongoDB doesn't appear to be running on port 27017${NC}"
    echo "Please start MongoDB first:"
    echo "  sudo systemctl start mongod"
    echo "  or"
    echo "  mongod"
    exit 1
fi
echo ""

# Function to start a service
start_service() {
    local name=$1
    local port=$2
    local dir=$3
    
    echo "Starting $name on port $port..."
    
    # Check if port is already in use
    if check_port $port; then
        echo -e "${YELLOW}Port $port is already in use. $name may already be running.${NC}"
        return
    fi
    
    # Change to directory and start service
    cd "$dir" || exit
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for $name..."
        npm install
    fi
    
    # Start service in background
    npm start &
    local pid=$!
    
    # Wait a moment for service to start
    sleep 2
    
    # Check if service started successfully
    if kill -0 $pid 2>/dev/null; then
        echo -e "${GREEN}$name started successfully (PID: $pid)${NC}"
    else
        echo -e "${RED}Failed to start $name${NC}"
    fi
    
    cd - >/dev/null || exit
}

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit

# Start all services
start_service "User Service" 3001 "user-service"
sleep 2

start_service "Menu Service" 3002 "menu-service"
sleep 2

start_service "Order Service" 3003 "order-service"
sleep 2

start_service "Notification Service" 3004 "notification-service"
sleep 2

start_service "API Gateway" 4000 "api-gateway"

echo ""
echo "=========================================="
echo -e "${GREEN}All backend services started!${NC}"
echo "=========================================="
echo ""
echo "Services:"
echo "  - User Service:      http://localhost:3001"
echo "  - Menu Service:      http://localhost:3002"
echo "  - Order Service:     http://localhost:3003"
echo "  - Notification:      http://localhost:3004"
echo "  - API Gateway:       http://localhost:4000"
echo ""
echo "To start the frontend:"
echo "  cd frontend"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
trap 'echo ""; echo "Stopping all services..."; kill $(jobs -p) 2>/dev/null; exit' INT
wait

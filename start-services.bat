@echo off
REM FoodHub Microservices Startup Script for Windows
REM This script starts all backend services in separate windows

echo ==========================================
echo FoodHub - Starting All Services
echo ==========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
netstat -an | findstr :27017 >nul
if errorlevel 1 (
    echo WARNING: MongoDB doesn't appear to be running on port 27017
    echo Please start MongoDB first:
    echo   net start MongoDB
    echo.
    pause
    exit /b 1
)
echo MongoDB is running!
echo.

REM Start User Service
echo Starting User Service on port 3001...
start "User Service (3001)" cmd /k "cd user-service && npm install && npm start"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Menu Service
echo Starting Menu Service on port 3002...
start "Menu Service (3002)" cmd /k "cd menu-service && npm install && npm start"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Order Service
echo Starting Order Service on port 3003...
start "Order Service (3003)" cmd /k "cd order-service && npm install && npm start"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Notification Service
echo Starting Notification Service on port 3004...
start "Notification Service (3004)" cmd /k "cd notification-service && npm install && npm start"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start API Gateway
echo Starting API Gateway on port 4000...
start "API Gateway (4000)" cmd /k "cd api-gateway && npm install && npm start"

echo.
echo ==========================================
echo All backend services started!
echo ==========================================
echo.
echo Services:
echo   - User Service:      http://localhost:3001
echo   - Menu Service:      http://localhost:3002
echo   - Order Service:     http://localhost:3003
echo   - Notification:      http://localhost:3004
echo   - API Gateway:       http://localhost:4000
echo.
echo To start the frontend:
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause

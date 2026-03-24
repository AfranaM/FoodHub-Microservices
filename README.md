<<<<<<< HEAD
# FoodHub - Microservices-Based Online Food Ordering System

A robust, scalable, and modern food ordering platform built with microservices architecture.

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │  React + Vite + Tailwind CSS (Port 5173)
│   (Port 5173)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │  Express + HTTP Proxy (Port 4000)
│  (Port 4000)    │
└────────┬────────┘
         │
    ┌────┴────┬────────┬───────────┬──────────────┐
    │         │        │           │              │
    ▼         ▼        ▼           ▼              ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────────┐
│ User │ │ Menu │ │Order │ │Notification│ │  MongoDB    │
│ 3001 │ │ 3002 │ │ 3003 │ │   3004    │ │   27017     │
└──────┘ └──────┘ └──────┘ └──────────┘ └──────────────┘
```

## Services & Ports

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| Frontend | 5173 | - | React web application |
| API Gateway | 4000 | - | Request routing & load balancing |
| User Service | 3001 | userDB | Authentication & user management |
| Menu Service | 3002 | menuDB | Food items & menu management |
| Order Service | 3003 | orderDB | Order processing & tracking |
| Notification Service | 3004 | notificationDB | Notifications & alerts |
| MongoDB | 27017 | - | Database server |

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**
- **Docker** & **Docker Compose** (optional, for containerized deployment)

## Project Structure

```
IBM_foodapp/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React contexts (Auth, Cart)
│   │   └── utils/        # API utilities
│   ├── package.json
│   └── vite.config.js
│
├── api-gateway/          # API Gateway service
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── user-service/         # User authentication service
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── Dockerfile
│
├── menu-service/         # Menu management service
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   ├── package.json
│   └── Dockerfile
│
├── order-service/        # Order processing service
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── Dockerfile
│
├── notification-service/ # Notification service
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml    # Docker orchestration
└── README.md            # This file
```

## Quick Start

### Option 1: Manual Setup (Recommended for Development)

#### Step 1: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start MongoDB manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

Verify MongoDB is running:
```bash
mongosh --eval "db.adminCommand('ping')"
```

#### Step 2: Start Backend Services

Open separate terminal windows for each service and run:

```bash
# Terminal 1 - User Service (Port 3001)
cd user-service
npm install
npm start

# Terminal 2 - Menu Service (Port 3002)
cd menu-service
npm install
npm start

# Terminal 3 - Order Service (Port 3003)
cd order-service
npm install
npm start

# Terminal 4 - Notification Service (Port 3004)
cd notification-service
npm install
npm start

# Terminal 5 - API Gateway (Port 4000)
cd api-gateway
npm install
npm start
```

#### Step 3: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Step 4: Seed Menu Data

Once all services are running, seed the menu database:

```bash
curl -X POST http://localhost:4000/api/menu/seed
```

Or use the browser to visit: `http://localhost:4000/api/menu/seed`

#### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:4000

---

### Option 2: Docker Setup (Recommended for Production)

#### Step 1: Start All Services with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

#### Step 2: Seed Menu Data

```bash
curl -X POST http://localhost:4000/api/menu/seed
```

#### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:4000

#### Step 4: Stop Services

```bash
docker-compose down

# To remove volumes as well
docker-compose down -v
```

---

## API Endpoints

### User Service (Port 3001)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/users/health | Health check | No |
| POST | /api/users/register | Register new user | No |
| POST | /api/users/login | Login user | No |
| GET | /api/users/profile | Get user profile | Yes |
| PUT | /api/users/profile | Update profile | Yes |

### Menu Service (Port 3002)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/menu/health | Health check | No |
| POST | /api/menu/seed | Seed menu data | No |
| GET | /api/menu/categories/list | Get categories | No |
| GET | /api/menu | Get all menu items | No |
| GET | /api/menu/:id | Get single item | No |
| POST | /api/menu | Create menu item | No |
| PUT | /api/menu/:id | Update menu item | No |
| DELETE | /api/menu/:id | Delete menu item | No |

### Order Service (Port 3003)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/orders/health | Health check | No |
| GET | /api/orders | Get my orders | Yes |
| GET | /api/orders/stats/my | Get order stats | Yes |
| GET | /api/orders/:id | Get single order | Yes |
| POST | /api/orders | Create order | Yes |
| PUT | /api/orders/:id/status | Update order status | Yes |
| PUT | /api/orders/:id/cancel | Cancel order | Yes |

### Notification Service (Port 3004)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/notifications/health | Health check | No |
| GET | /api/notifications | Get notifications | Yes |
| POST | /api/notifications | Create notification | Yes |
| POST | /api/notifications/order | Send order notification | Yes |
| PUT | /api/notifications/read-all | Mark all as read | Yes |
| PUT | /api/notifications/:id/read | Mark as read | Yes |
| DELETE | /api/notifications/:id | Delete notification | Yes |

---

## Frontend Pages

| Page | Route | Description | Auth Required |
|------|-------|-------------|---------------|
| Home | / | Landing page with features | No |
| Login | /login | User login | No |
| Register | /register | User registration | No |
| Menu | /menu | Browse food menu | No |
| Checkout | /checkout | Place order with address | Yes |
| Order History | /orders | View past orders | Yes |

---

## Testing the Application

### End-to-End Flow Test

1. **Register a new account**
   - Go to http://localhost:5173/register
   - Fill in name, email, password
   - Click "Create Account"

2. **Login**
   - Go to http://localhost:5173/login
   - Enter email and password
   - Click "Sign In"

3. **Browse Menu**
   - Go to http://localhost:5173/menu
   - Browse food items
   - Add items to cart

4. **Checkout**
   - Click cart icon
   - Click "Proceed to Checkout"
   - Fill in delivery address
   - Select payment method
   - Click "Place Order"

5. **View Order History**
   - Go to http://localhost:5173/orders
   - View order details and status

---

## Health Check Endpoints

Verify all services are running:

```bash
# API Gateway
curl http://localhost:4000/health

# User Service
curl http://localhost:3001/api/users/health

# Menu Service
curl http://localhost:3002/api/menu/health

# Order Service
curl http://localhost:3003/api/orders/health

# Notification Service
curl http://localhost:3004/api/notifications/health
```

---

## Troubleshooting

### MongoDB Connection Issues

**Error**: "MongoDB not running. Please start MongoDB service."

**Solution**:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use

**Error**: "Port XXXX is already in use"

**Solution**:
```bash
# Find and kill process using the port (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Find and kill process (macOS/Linux)
lsof -ti:3001 | xargs kill -9
```

### CORS Issues

All services have CORS enabled. If you encounter CORS errors:
1. Ensure all services are running on correct ports
2. Check that the API Gateway is properly routing requests
3. Verify the frontend is using the correct BASE_URL

### Service Not Responding

1. Check service logs for errors
2. Verify MongoDB is running
3. Ensure all required environment variables are set
4. Check network connectivity between services

---

## Environment Variables

### User Service
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/userDB
JWT_SECRET=your-secret-key
```

### Menu Service
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/menuDB
```

### Order Service
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/orderDB
JWT_SECRET=your-secret-key
```

### Notification Service
```env
PORT=3004
MONGODB_URI=mongodb://localhost:27017/notificationDB
JWT_SECRET=your-secret-key
```

### API Gateway
```env
PORT=4000
USER_SERVICE_URL=http://localhost:3001
MENU_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

### Frontend
```env
VITE_API_URL=http://localhost:4000/api
```

---

## Development Tips

### Using Nodemon for Auto-reload

Install nodemon globally:
```bash
npm install -g nodemon
```

Run services with auto-reload:
```bash
npm run dev  # Uses nodemon
```

### Viewing Logs

Each service logs to the console:
- Incoming requests
- Database connections
- Errors and warnings

### Database Inspection

Use MongoDB Compass or mongosh to inspect databases:
```bash
mongosh
show dbs
use userDB
show collections
db.users.find()
```

---

## Production Deployment

1. **Set strong JWT secrets**
2. **Enable MongoDB authentication**
3. **Use HTTPS for all communications**
4. **Set up proper logging and monitoring**
5. **Use environment-specific configuration**
6. **Enable rate limiting on API Gateway**

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- express-http-proxy for API Gateway
- CORS for cross-origin requests

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React icons

### DevOps
- Docker
- Docker Compose

---

## License

MIT License - Feel free to use this project for learning and development.

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review service logs
3. Verify all services are running
4. Check MongoDB connection

---

## Author

Built with for IBM FoodApp Project.
=======
# FoodHub-Microservices
Microservices-based food ordering system built with React, Node.js, Express, and MongoDB using API Gateway architecture and JWT authentication.
>>>>>>> ccd613f51f6de3b8a7dc12f721bd05ca2ba44e94

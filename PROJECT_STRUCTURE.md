# FoodHub Project Structure

## Complete Directory Tree

```
IBM_foodapp/
│
├── .gitignore                    # Git ignore rules
├── README.md                     # Main documentation
├── API_ENDPOINTS.md              # API reference
├── PROJECT_STRUCTURE.md          # This file
├── docker-compose.yml            # Docker orchestration
├── start-services.bat            # Windows startup script
├── start-services.sh             # Linux/macOS startup script
│
├── frontend/                     # React Frontend Application
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│   └── src/
│       ├── main.jsx              # Application entry point
│       ├── App.jsx               # Main app component with routes
│       ├── index.css             # Global styles & Tailwind
│       │
│       ├── components/           # Reusable UI components
│       │   ├── Navbar.jsx        # Navigation bar
│       │   ├── Loading.jsx       # Loading spinners
│       │   └── ErrorMessage.jsx  # Error & success messages
│       │
│       ├── context/              # React Context providers
│       │   ├── AuthContext.jsx   # Authentication state
│       │   └── CartContext.jsx   # Shopping cart state
│       │
│       ├── pages/                # Page components
│       │   ├── Home.jsx          # Landing page
│       │   ├── Login.jsx         # Login page
│       │   ├── Register.jsx      # Registration page
│       │   ├── Menu.jsx          # Food menu page
│       │   ├── Checkout.jsx      # Order checkout page
│       │   └── OrderHistory.jsx  # Order history page
│       │
│       └── utils/                # Utility functions
│           └── api.js            # API client & endpoints
│
├── api-gateway/                  # API Gateway Service
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                 # Express proxy server
│
├── user-service/                 # User Authentication Service (Port 3001)
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                 # Main server file
│   │
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controllers/
│   │   └── userController.js     # User business logic
│   │
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   │
│   ├── models/
│   │   └── User.js               # User Mongoose schema
│   │
│   └── routes/
│       └── userRoutes.js         # User API routes
│
├── menu-service/                 # Menu Management Service (Port 3002)
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                 # Main server file
│   │
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controllers/
│   │   └── menuController.js     # Menu business logic
│   │
│   ├── models/
│   │   └── MenuItem.js           # MenuItem Mongoose schema
│   │
│   └── routes/
│       └── menuRoutes.js         # Menu API routes
│
├── order-service/                # Order Processing Service (Port 3003)
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                 # Main server file
│   │
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controllers/
│   │   └── orderController.js    # Order business logic
│   │
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   │
│   ├── models/
│   │   └── Order.js              # Order Mongoose schema
│   │
│   └── routes/
│       └── orderRoutes.js        # Order API routes
│
└── notification-service/         # Notification Service (Port 3004)
    ├── .dockerignore
    ├── .env.example
    ├── Dockerfile
    ├── package.json
    ├── server.js                 # Main server file
    │
    ├── config/
    │   └── db.js                 # MongoDB connection
    │
    ├── controllers/
    │   └── notificationController.js  # Notification business logic
    │
    ├── middleware/
    │   └── auth.js               # JWT authentication middleware
    │
    ├── models/
    │   └── Notification.js       # Notification Mongoose schema
    │
    └── routes/
        └── notificationRoutes.js # Notification API routes
```

## Service Architecture

### Frontend (Port 5173)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context (Auth, Cart)
- **Routing**: React Router
- **HTTP Client**: Axios
- **Icons**: Lucide React

### API Gateway (Port 4000)
- **Framework**: Express.js
- **Proxy**: express-http-proxy
- **CORS**: Enabled for all origins
- **Routes**:
  - `/api/users` → User Service (3001)
  - `/api/menu` → Menu Service (3002)
  - `/api/orders` → Order Service (3003)
  - `/api/notifications` → Notification Service (3004)

### User Service (Port 3001)
- **Database**: userDB
- **Features**:
  - User registration
  - User login
  - JWT authentication
  - Profile management
- **Models**: User

### Menu Service (Port 3002)
- **Database**: menuDB
- **Features**:
  - Menu item CRUD
  - Category filtering
  - Search functionality
  - Data seeding
- **Models**: MenuItem

### Order Service (Port 3003)
- **Database**: orderDB
- **Features**:
  - Order creation
  - Order tracking
  - Order history
  - Order statistics
- **Models**: Order

### Notification Service (Port 3004)
- **Database**: notificationDB
- **Features**:
  - Notification creation
  - Notification retrieval
  - Mark as read
  - Order notifications
- **Models**: Notification

## Data Flow

```
User Request
    │
    ▼
┌─────────────┐
│   Frontend  │  React App (Port 5173)
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│ API Gateway │  Express Proxy (Port 4000)
└──────┬──────┘
       │ Proxy Request
       ▼
┌─────────────────────────────────────────────────┐
│              Backend Services                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  User    │ │   Menu   │ │  Order   │  ...   │
│  │ Service  │ │ Service  │ │ Service  │        │
│  │ (3001)   │ │ (3002)   │ │ (3003)   │        │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘        │
│       │            │            │               │
│       └────────────┴────────────┘               │
│                    │                            │
│                    ▼                            │
│              ┌──────────┐                       │
│              │ MongoDB  │                       │
│              │ (27017)  │                       │
│              └──────────┘                       │
└─────────────────────────────────────────────────┘
```

## File Purposes

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies and scripts |
| `Dockerfile` | Docker image configuration |
| `.dockerignore` | Files to exclude from Docker build |
| `.env.example` | Environment variable template |
| `.gitignore` | Files to exclude from Git |

### Frontend Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS configuration |
| `index.html` | HTML entry point |
| `main.jsx` | React application entry |
| `App.jsx` | Main app with routing |
| `index.css` | Global styles |

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Express server setup |
| `config/db.js` | Database connection |
| `models/*.js` | Mongoose schemas |
| `controllers/*.js` | Business logic |
| `routes/*.js` | API route definitions |
| `middleware/*.js` | Express middleware |

## Database Schemas

### User Collection (userDB)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  role: String (user|admin),
  createdAt: Date
}
```

### MenuItem Collection (menuDB)
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  ingredients: [String],
  isVegetarian: Boolean,
  isVegan: Boolean,
  isGlutenFree: Boolean,
  isSpicy: Boolean,
  calories: Number,
  preparationTime: Number,
  isAvailable: Boolean,
  rating: Number,
  reviewCount: Number,
  createdAt: Date
}
```

### Order Collection (orderDB)
```javascript
{
  userId: String,
  orderNumber: String (unique),
  items: [{
    menuItemId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  deliveryAddress: {
    street: String,
    city: String,
    zipCode: String,
    phone: String,
    instructions: String
  },
  status: String (pending|confirmed|preparing|ready|out-for-delivery|delivered|cancelled),
  paymentStatus: String (pending|completed|failed|refunded),
  paymentMethod: String (cash|card|online),
  deliveryTime: {
    estimated: Date,
    actual: Date
  },
  notes: String,
  createdAt: Date
}
```

### Notification Collection (notificationDB)
```javascript
{
  userId: String,
  type: String (order|promotion|system|delivery),
  title: String,
  message: String,
  data: Object,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

## Key Design Decisions

### 1. Microservices Architecture
- Each service has its own database
- Services communicate through API Gateway
- Independent deployment and scaling

### 2. Database-per-Service
- userDB: User data
- menuDB: Menu items
- orderDB: Order data
- notificationDB: Notifications

### 3. API Gateway Pattern
- Single entry point for all clients
- Request routing to appropriate services
- Centralized CORS handling

### 4. JWT Authentication
- Stateless authentication
- Token-based security
- Middleware protection for routes

### 5. React Context for State
- AuthContext: User authentication state
- CartContext: Shopping cart state
- No external state management library needed

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Add model (if needed)
   - Add controller methods
   - Add routes
   - Test with curl/Postman

2. **Frontend**:
   - Add API endpoint in `utils/api.js`
   - Create/update component
   - Add route in `App.jsx`
   - Test in browser

3. **Integration**:
   - Test end-to-end flow
   - Verify error handling
   - Check responsive design

## Scaling Considerations

### Horizontal Scaling
- Each service can be scaled independently
- Load balancer in front of API Gateway
- MongoDB replica sets for database scaling

### Caching
- Redis for session storage
- CDN for static assets
- API response caching

### Monitoring
- Health check endpoints on all services
- Centralized logging
- Performance metrics

## Security Measures

1. **Authentication**: JWT tokens
2. **Password Hashing**: bcrypt
3. **CORS**: Configured per service
4. **Input Validation**: Mongoose schemas
5. **Error Handling**: No sensitive data in errors

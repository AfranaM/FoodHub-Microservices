# FoodHub API Endpoints Reference

## Base URL

All API requests should be made through the API Gateway:

```
http://localhost:4000/api
```

---

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## User Service Endpoints

### Public Endpoints

#### Health Check
```http
GET /users/health
```

**Response:**
```json
{
  "success": true,
  "service": "user-service",
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "6579a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user"
    }
  }
}
```

#### Login User
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "6579a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "address": {
        "street": "",
        "city": "",
        "zipCode": ""
      }
    }
  }
}
```

### Protected Endpoints (Require Authentication)

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "6579a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+0987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "zipCode": "90001"
  }
}
```

---

## Menu Service Endpoints

### Public Endpoints

#### Health Check
```http
GET /menu/health
```

#### Seed Menu Data
```http
POST /menu/seed
```

**Response:**
```json
{
  "success": true,
  "message": "Seeded 10 menu items successfully",
  "count": 10
}
```

#### Get Categories
```http
GET /menu/categories/list
```

**Response:**
```json
{
  "success": true,
  "data": ["appetizer", "main-course", "dessert", "beverage", "snack", "combo"]
}
```

#### Get All Menu Items
```http
GET /menu
```

**Query Parameters:**
- `category` (optional): Filter by category (e.g., `main-course`)
- `search` (optional): Search in name and description
- `vegetarian` (optional): `true` to show only vegetarian items
- `available` (optional): `false` to include unavailable items

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "6579a1b2c3d4e5f6g7h8i9j0",
      "name": "Margherita Pizza",
      "description": "Classic Italian pizza with fresh mozzarella, tomatoes, and basil",
      "price": 12.99,
      "category": "main-course",
      "image": "https://images.unsplash.com/...",
      "ingredients": ["Pizza dough", "Mozzarella cheese", "Tomato sauce", "Fresh basil"],
      "isVegetarian": true,
      "isVegan": false,
      "isGlutenFree": false,
      "isSpicy": false,
      "calories": 850,
      "preparationTime": 20,
      "isAvailable": true,
      "rating": 4.5,
      "reviewCount": 128
    }
  ]
}
```

#### Get Single Menu Item
```http
GET /menu/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6579a1b2c3d4e5f6g7h8i9j0",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza...",
    "price": 12.99,
    "category": "main-course",
    "image": "https://images.unsplash.com/...",
    "ingredients": [...],
    "isVegetarian": true,
    "calories": 850,
    "preparationTime": 20,
    "isAvailable": true,
    "rating": 4.5,
    "reviewCount": 128
  }
}
```

#### Create Menu Item
```http
POST /menu
```

**Request Body:**
```json
{
  "name": "New Dish",
  "description": "Description of the dish",
  "price": 15.99,
  "category": "main-course",
  "image": "https://example.com/image.jpg",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "isVegetarian": true,
  "calories": 500,
  "preparationTime": 15
}
```

#### Update Menu Item
```http
PUT /menu/:id
```

**Request Body:** (Partial or full update)
```json
{
  "price": 16.99,
  "isAvailable": false
}
```

#### Delete Menu Item
```http
DELETE /menu/:id
```

---

## Order Service Endpoints

### Public Endpoints

#### Health Check
```http
GET /orders/health
```

### Protected Endpoints (Require Authentication)

#### Get My Orders
```http
GET /orders
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "6579a1b2c3d4e5f6g7h8i9j0",
      "userId": "user-id-here",
      "orderNumber": "FHABC123XYZ",
      "items": [
        {
          "menuItemId": "menu-item-id",
          "name": "Margherita Pizza",
          "price": 12.99,
          "quantity": 2,
          "image": "https://images.unsplash.com/..."
        }
      ],
      "totalAmount": 25.98,
      "deliveryAddress": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001",
        "phone": "+1234567890",
        "instructions": "Leave at door"
      },
      "status": "delivered",
      "paymentStatus": "completed",
      "paymentMethod": "cash",
      "deliveryTime": {
        "estimated": "2024-01-01T01:00:00.000Z",
        "actual": "2024-01-01T00:55:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Order
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Get My Order Statistics
```http
GET /orders/stats/my
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalOrders": 15,
      "totalSpent": 450.50,
      "avgOrderValue": 30.03
    },
    "statusBreakdown": [
      { "_id": "delivered", "count": 12 },
      { "_id": "pending", "count": 2 },
      { "_id": "cancelled", "count": 1 }
    ]
  }
}
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "menuItemId": "6579a1b2c3d4e5f6g7h8i9j0",
      "name": "Margherita Pizza",
      "price": 12.99,
      "quantity": 2,
      "image": "https://images.unsplash.com/..."
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "phone": "+1234567890",
    "instructions": "Leave at door"
  },
  "paymentMethod": "cash",
  "notes": "Extra cheese please"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "order-id-here",
    "orderNumber": "FHABC123XYZ",
    "userId": "user-id-here",
    "items": [...],
    "totalAmount": 25.98,
    "deliveryAddress": {...},
    "status": "pending",
    "paymentMethod": "cash",
    "deliveryTime": {
      "estimated": "2024-01-01T01:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Order Status
```http
PUT /orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `out-for-delivery`
- `delivered`
- `cancelled`

#### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <token>
```

---

## Notification Service Endpoints

### Public Endpoints

#### Health Check
```http
GET /notifications/health
```

### Protected Endpoints (Require Authentication)

#### Get Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

**Query Parameters:**
- `unreadOnly` (optional): `true` to show only unread notifications
- `limit` (optional): Number of notifications to return (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "unreadCount": 2,
  "data": [
    {
      "_id": "notification-id",
      "userId": "user-id",
      "type": "order",
      "title": "Order Confirmed",
      "message": "Your order #FHABC123 has been confirmed",
      "data": {
        "orderNumber": "FHABC123",
        "status": "confirmed"
      },
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Notification
```http
POST /notifications
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "system",
  "title": "Welcome",
  "message": "Welcome to FoodHub!",
  "data": {}
}
```

#### Send Order Notification
```http
POST /notifications/order
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user-id",
  "orderNumber": "FHABC123",
  "status": "confirmed",
  "totalAmount": 25.98
}
```

#### Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All Notifications as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

#### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

---

## Error Responses

All services return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Testing with cURL

### Register a User
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Menu Items
```bash
curl http://localhost:4000/api/menu
```

### Create Order (with token)
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {
        "menuItemId": "menu-item-id",
        "name": "Pizza",
        "price": 12.99,
        "quantity": 1,
        "image": "image-url"
      }
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001",
      "phone": "+1234567890"
    },
    "paymentMethod": "cash"
  }'
```

### Get My Orders
```bash
curl http://localhost:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider adding:
- Request rate limiting per IP
- Authentication attempt limiting
- API quota management

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial release |

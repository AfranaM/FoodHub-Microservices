const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[API Gateway] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy options helper
const proxyOptions = (serviceName) => ({
  proxyReqPathResolver: function (req) {
    // Preserve the original path including the /api prefix
    const resolvedPath = req.originalUrl;
    console.log(`[API Gateway] ${serviceName} - Proxying to: ${resolvedPath}`);
    return resolvedPath;
  },
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward authorization header
    if (srcReq.headers.authorization) {
      proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
    }
    return proxyReqOpts;
  },
  userResHeaderDecorator: function(headers, userReq, userRes, proxyReq, proxyRes) {
    // Add CORS headers
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return headers;
  },
  proxyErrorHandler: function(err, res, next) {
    console.error(`[API Gateway] ${serviceName} Proxy Error:`, err.message);
    res.status(503).json({
      success: false,
      message: `${serviceName} is unavailable. Please try again later.`
    });
  }
});

// Service URLs
const USER_SERVICE_URL = 'http://localhost:3001';
const MENU_SERVICE_URL = 'http://localhost:3002';
const ORDER_SERVICE_URL = 'http://localhost:3003';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3004';

// Proxy routes - DO NOT strip paths, forward as-is
app.use('/api/users', proxy(USER_SERVICE_URL, proxyOptions('User Service')));
app.use('/api/menu', proxy(MENU_SERVICE_URL, proxyOptions('Menu Service')));
app.use('/api/orders', proxy(ORDER_SERVICE_URL, proxyOptions('Order Service')));
app.use('/api/notifications', proxy(NOTIFICATION_SERVICE_URL, proxyOptions('Notification Service')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      user: 'http://localhost:3001',
      menu: 'http://localhost:3002',
      order: 'http://localhost:3003',
      notification: 'http://localhost:3004'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FoodHub API Gateway',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      menu: '/api/menu',
      orders: '/api/orders',
      notifications: '/api/notifications'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/users',
      '/api/menu',
      '/api/orders',
      '/api/notifications',
      '/health'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[API Gateway] Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[API Gateway] Server started on port ${PORT}`);
  console.log(`[API Gateway] http://localhost:${PORT}`);
  console.log('[API Gateway] Routes:');
  console.log('  - /api/users -> http://localhost:3001');
  console.log('  - /api/menu -> http://localhost:3002');
  console.log('  - /api/orders -> http://localhost:3003');
  console.log('  - /api/notifications -> http://localhost:3004');
});

module.exports = app;

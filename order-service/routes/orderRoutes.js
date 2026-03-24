const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrder, 
  updateOrderStatus, 
  cancelOrder,
  getMyOrderStats,
  healthCheck
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Health check - Public
router.get('/health', healthCheck);

// Protected routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/stats/my', protect, getMyOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;

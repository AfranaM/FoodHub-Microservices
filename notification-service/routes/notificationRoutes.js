const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  createNotification, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  sendOrderNotification,
  healthCheck
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Health check - Public
router.get('/health', healthCheck);

// Protected routes
router.get('/', protect, getNotifications);
router.post('/', protect, createNotification);
router.post('/order', protect, sendOrderNotification);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;

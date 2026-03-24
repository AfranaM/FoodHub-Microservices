const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, healthCheck } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Health check - Public
router.get('/health', healthCheck);

// Authentication routes - Public
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;

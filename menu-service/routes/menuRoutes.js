const express = require('express');
const router = express.Router();
const { 
  getAllMenuItems, 
  getMenuItem, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getCategories,
  seedMenuItems,
  healthCheck
} = require('../controllers/menuController');

// Health check - Public
router.get('/health', healthCheck);

// Seed data - Public (for demo)
router.post('/seed', seedMenuItems);

// Categories - Public
router.get('/categories/list', getCategories);

// Menu items - Public
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItem);

// Admin routes (in production, add auth middleware)
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;

const Order = require('../models/Order');
const axios = require('axios');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    console.log('[Order Service] Creating new order');
    
    const { items, deliveryAddress, paymentMethod, notes } = req.body;
    const userId = req.user.id;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one item'
      });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery address (street, city, zipCode)'
      });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.menuItemId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have menuItemId, name, price, and quantity'
        });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || ''
    });

    // Set estimated delivery time (30-45 minutes from now)
    const estimatedTime = new Date(Date.now() + (35 * 60 * 1000));
    order.deliveryTime.estimated = estimatedTime;
    await order.save();

    console.log(`[Order Service] Order created: ${order.orderNumber}`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error(`[Order Service] Error creating order: ${error.message}`);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all orders for logged in user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    console.log(`[Order Service] Getting orders for user: ${req.user.id}`);
    
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error(`[Order Service] Error getting orders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    console.log(`[Order Service] Getting order: ${req.params.id}`);
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(`[Order Service] Error getting order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    console.log(`[Order Service] Updating order status: ${req.params.id}`);
    
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    
    // If delivered, set actual delivery time
    if (status === 'delivered') {
      order.deliveryTime.actual = new Date();
    }
    
    await order.save();

    console.log(`[Order Service] Order status updated: ${order.orderNumber} -> ${status}`);

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    console.error(`[Order Service] Error updating order status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    console.log(`[Order Service] Cancelling order: ${req.params.id}`);
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    order.status = 'cancelled';
    await order.save();

    console.log(`[Order Service] Order cancelled: ${order.orderNumber}`);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error(`[Order Service] Error cancelling order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/my
// @access  Private
exports.getMyOrderStats = async (req, res) => {
  try {
    console.log(`[Order Service] Getting order stats for user: ${req.user.id}`);
    
    const stats = await Order.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const statusCounts = await Order.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || { totalOrders: 0, totalSpent: 0, avgOrderValue: 0 },
        statusBreakdown: statusCounts
      }
    });
  } catch (error) {
    console.error(`[Order Service] Error getting order stats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Health check
// @route   GET /api/orders/health
// @access  Public
exports.healthCheck = async (req, res) => {
  res.status(200).json({
    success: true,
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};

const Notification = require('../models/Notification');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    console.log(`[Notification Service] Getting notifications for user: ${req.user.id}`);
    
    const { unreadOnly, limit = 20 } = req.query;
    
    const filter = { userId: req.user.id };
    
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error(`[Notification Service] Error getting notifications: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = async (req, res) => {
  try {
    console.log('[Notification Service] Creating notification');
    
    const { type, title, message, data } = req.body;
    const userId = req.user.id;

    // Validation
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and message'
      });
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data: data || {}
    });

    console.log(`[Notification Service] Notification created: ${notification._id}`);

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: notification
    });
  } catch (error) {
    console.error(`[Notification Service] Error creating notification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    console.log(`[Notification Service] Marking notification as read: ${req.params.id}`);
    
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error(`[Notification Service] Error marking notification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    console.log(`[Notification Service] Marking all notifications as read for user: ${req.user.id}`);
    
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error(`[Notification Service] Error marking all notifications: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    console.log(`[Notification Service] Deleting notification: ${req.params.id}`);
    
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error(`[Notification Service] Error deleting notification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Send order notification (internal use)
// @route   POST /api/notifications/order
// @access  Private
exports.sendOrderNotification = async (req, res) => {
  try {
    const { userId, orderNumber, status, totalAmount } = req.body;

    let title, message;

    switch (status) {
      case 'confirmed':
        title = 'Order Confirmed';
        message = `Your order #${orderNumber} has been confirmed and is being prepared.`;
        break;
      case 'preparing':
        title = 'Order Being Prepared';
        message = `Your order #${orderNumber} is now being prepared in the kitchen.`;
        break;
      case 'out-for-delivery':
        title = 'Out for Delivery';
        message = `Your order #${orderNumber} is on its way to you!`;
        break;
      case 'delivered':
        title = 'Order Delivered';
        message = `Your order #${orderNumber} has been delivered. Enjoy your meal!`;
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        message = `Your order #${orderNumber} has been cancelled.`;
        break;
      default:
        title = 'Order Update';
        message = `Your order #${orderNumber} status has been updated to: ${status}`;
    }

    const notification = await Notification.create({
      userId,
      type: 'order',
      title,
      message,
      data: { orderNumber, status, totalAmount }
    });

    console.log(`[Notification Service] Order notification sent: ${orderNumber}`);

    res.status(201).json({
      success: true,
      message: 'Order notification sent',
      data: notification
    });
  } catch (error) {
    console.error(`[Notification Service] Error sending order notification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Health check
// @route   GET /api/notifications/health
// @access  Public
exports.healthCheck = async (req, res) => {
  res.status(200).json({
    success: true,
    service: 'notification-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};

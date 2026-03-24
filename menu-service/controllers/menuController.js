const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getAllMenuItems = async (req, res) => {
  try {
    console.log('[Menu Service] Getting all menu items');
    
    const { category, search, vegetarian, available } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category.toLowerCase();
    }
    
    if (vegetarian === 'true') {
      filter.isVegetarian = true;
    }
    
    if (available !== 'false') {
      filter.isAvailable = true;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error(`[Menu Service] Error getting menu items: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res) => {
  try {
    console.log(`[Menu Service] Getting menu item: ${req.params.id}`);
    
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error(`[Menu Service] Error getting menu item: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private (Admin)
exports.createMenuItem = async (req, res) => {
  try {
    console.log('[Menu Service] Creating new menu item');
    
    const menuItem = await MenuItem.create(req.body);

    console.log(`[Menu Service] Menu item created: ${menuItem.name}`);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error(`[Menu Service] Error creating menu item: ${error.message}`);
    
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

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin)
exports.updateMenuItem = async (req, res) => {
  try {
    console.log(`[Menu Service] Updating menu item: ${req.params.id}`);
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    console.log(`[Menu Service] Menu item updated: ${menuItem.name}`);

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error(`[Menu Service] Error updating menu item: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    console.log(`[Menu Service] Deleting menu item: ${req.params.id}`);
    
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    console.log(`[Menu Service] Menu item deleted: ${menuItem.name}`);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error(`[Menu Service] Error deleting menu item: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get menu categories
// @route   GET /api/menu/categories/list
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    console.log('[Menu Service] Getting categories');
    
    const categories = await MenuItem.distinct('category');

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(`[Menu Service] Error getting categories: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Seed menu items (for initial data)
// @route   POST /api/menu/seed
// @access  Public (for demo purposes)
exports.seedMenuItems = async (req, res) => {
  try {
    console.log('[Menu Service] Seeding menu items');
    
    // Check if items already exist
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Menu already has items. Delete existing items first.'
      });
    }

    const menuItems = [
      {
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
        price: 12.99,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        ingredients: ['Pizza dough', 'Mozzarella cheese', 'Tomato sauce', 'Fresh basil'],
        isVegetarian: true,
        calories: 850,
        preparationTime: 20
      },
      {
        name: 'Chicken Burger',
        description: 'Juicy grilled chicken breast with lettuce, tomato, and special sauce',
        price: 9.99,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        ingredients: ['Chicken breast', 'Burger bun', 'Lettuce', 'Tomato', 'Special sauce'],
        calories: 650,
        preparationTime: 15
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
        price: 8.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
        ingredients: ['Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan cheese'],
        isVegetarian: true,
        calories: 320,
        preparationTime: 10
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream',
        price: 7.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
        ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla ice cream'],
        isVegetarian: true,
        calories: 450,
        preparationTime: 15
      },
      {
        name: 'Fresh Orange Juice',
        description: '100% freshly squeezed orange juice',
        price: 4.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
        ingredients: ['Fresh oranges'],
        isVegetarian: true,
        isVegan: true,
        calories: 120,
        preparationTime: 5
      },
      {
        name: 'Spicy Chicken Wings',
        description: 'Crispy chicken wings tossed in spicy buffalo sauce',
        price: 11.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        ingredients: ['Chicken wings', 'Buffalo sauce', 'Celery', 'Ranch dressing'],
        isSpicy: true,
        calories: 550,
        preparationTime: 18
      },
      {
        name: 'Vegetable Stir Fry',
        description: 'Fresh seasonal vegetables stir-fried with soy sauce and ginger',
        price: 10.99,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        ingredients: ['Broccoli', 'Bell peppers', 'Carrots', 'Snap peas', 'Soy sauce', 'Ginger'],
        isVegetarian: true,
        isVegan: true,
        calories: 280,
        preparationTime: 12
      },
      {
        name: 'Mango Smoothie',
        description: 'Refreshing smoothie made with fresh mangoes and yogurt',
        price: 5.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
        ingredients: ['Fresh mango', 'Yogurt', 'Honey', 'Ice'],
        isVegetarian: true,
        calories: 200,
        preparationTime: 5
      },
      {
        name: 'French Fries',
        description: 'Crispy golden fries served with ketchup',
        price: 4.99,
        category: 'snack',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        ingredients: ['Potatoes', 'Salt', 'Vegetable oil'],
        isVegetarian: true,
        isVegan: true,
        calories: 380,
        preparationTime: 10
      },
      {
        name: 'Family Combo Meal',
        description: '2 pizzas, 4 drinks, and 2 desserts - perfect for family sharing',
        price: 39.99,
        category: 'combo',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        ingredients: ['2 Large pizzas', '4 Soft drinks', '2 Desserts'],
        isVegetarian: true,
        calories: 2400,
        preparationTime: 25
      }
    ];

    await MenuItem.insertMany(menuItems);

    console.log(`[Menu Service] Seeded ${menuItems.length} menu items`);

    res.status(201).json({
      success: true,
      message: `Seeded ${menuItems.length} menu items successfully`,
      count: menuItems.length
    });
  } catch (error) {
    console.error(`[Menu Service] Error seeding menu items: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Health check
// @route   GET /api/menu/health
// @access  Public
exports.healthCheck = async (req, res) => {
  res.status(200).json({
    success: true,
    service: 'menu-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Plant from '../models/Plant.js';
const router = Router();

// GET /api/plants - Fetch plants with optional search and filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    // Build query object
    const query = {};
    
    // Add search filter (case-insensitive)
    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }
    
    // Add category filter
    if (category && category.trim()) {
      query.categories = category.trim();
    }
    
    // Execute query with sorting
    const plants = await Plant.find(query).sort({ name: 1 });
    
    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plants',
      error: error.message
    });
  }
});

// GET /api/plants/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Plant.distinct('categories');
    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET /api/plants/:id - Get single plant by ID
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching plant',
      error: error.message
    });
  }
});

// POST /api/plants - Create a new plant
router.post('/', [
  // Validation middleware
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plant name is required')
    .isLength({ max: 100 })
    .withMessage('Plant name cannot exceed 100 characters'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('categories')
    .custom((value) => {
      // Handle both string (comma-separated) and array inputs
      if (typeof value === 'string') {
        const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat);
        return categories.length > 0;
      } else if (Array.isArray(value)) {
        return value.length > 0;
      }
      return false;
    })
    .withMessage('At least one category is required'),
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean value')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let { name, price, categories, inStock = true } = req.body;
    
    // Process categories - handle both string and array inputs
    if (typeof categories === 'string') {
      categories = categories.split(',').map(cat => cat.trim()).filter(cat => cat);
    }
    
    // Create new plant
    const plant = new Plant({
      name: name.trim(),
      price: parseFloat(price),
      categories,
      inStock: Boolean(inStock)
    });
    
    const savedPlant = await plant.save();
    
    res.status(201).json({
      success: true,
      message: 'Plant created successfully',
      data: savedPlant
    });
  } catch (error) {
    console.error('Error creating plant:', error);
    
    // Handle duplicate name error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A plant with this name already exists',
        error: 'Duplicate plant name'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating plant',
      error: error.message
    });
  }
});

export default router;
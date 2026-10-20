const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, state, minPrice, maxPrice, inStock, sort } = req.query;
    let query = {};

    if (category && category !== 'All' && category !== '') {
      const categories = category.split(',').map(c => c.trim()).filter(Boolean);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } }
      ];
    }

    if (state && state !== 'All India' && state !== 'Select State' && state !== '') {
      query['location.state'] = { $regex: state, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.pricePerKg = {};
      if (minPrice) query.pricePerKg.$gte = Number(minPrice);
      if (maxPrice) query.pricePerKg.$lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { pricePerKg: 1 };
    if (sort === 'price-high') sortOption = { pricePerKg: -1 };
    if (sort === 'quantity') sortOption = { quantityAvailable: -1 };

    const products = await Product.find(query)
      .populate('farmer', 'name isVerified rating reviewCount avatar location phone')
      .sort(sortOption);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name isVerified rating reviewCount avatar location phone bio');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    res.json({
      product,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
});

// Create product (Farmer)
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      category,
      pricePerKg,
      quantityAvailable,
      unit,
      location,
      harvestDate,
      quality,
      images,
      description,
      organic
    } = req.body;

    const product = await Product.create({
      title,
      category,
      pricePerKg: Number(pricePerKg),
      quantityAvailable: Number(quantityAvailable),
      unit: unit || 'kg',
      location: location || req.user.location,
      farmer: req.user._id,
      harvestDate: harvestDate || '18 Oct 2026',
      quality: quality || 'Grade A',
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      description: description || 'Fresh produce direct from farm',
      organic: organic || false
    });

    const populated = await Product.findById(product._id).populate('farmer', 'name isVerified rating avatar');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Farmer's products
router.get('/farmer/my-products', protect, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farmer products' });
  }
});

// Update product
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only owner or admin can edit
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;

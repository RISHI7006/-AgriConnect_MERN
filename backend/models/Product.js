const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices']
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  minOrderQuantity: {
    type: Number,
    default: 10
  },
  location: {
    city: { type: String, default: 'Nashik' },
    state: { type: String, default: 'Maharashtra' }
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  harvestDate: {
    type: String,
    default: '16 Oct 2026'
  },
  quality: {
    type: String,
    default: 'Grade A'
  },
  images: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: 'Freshly harvested produce directly from certified sustainable farm.'
  },
  organic: {
    type: Boolean,
    default: false
  },
  shelfLife: {
    type: String,
    default: '7-10 Days'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

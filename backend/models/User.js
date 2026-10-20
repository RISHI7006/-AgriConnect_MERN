const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin'],
    default: 'buyer'
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  location: {
    city: { type: String, default: 'Nashik' },
    state: { type: String, default: 'Maharashtra' },
    address: { type: String, default: 'Gat No. 142, Pimpalgaon, Niphad, Nashik - 422209' }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'none'],
    default: 'pending'
  },
  verificationDoc: {
    type: String,
    default: 'Kisan_Credit_Card_Aadhaar.pdf'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  reviewCount: {
    type: Number,
    default: 120
  },
  avatar: {
    type: String,
    default: '/images/ramesh.jpg'
  },
  bio: {
    type: String,
    default: 'Passionate agricultural producer dedicated to chemical-free and sustainable farming practices.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

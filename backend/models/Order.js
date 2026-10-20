const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productTitle: {
    type: String,
    required: true
  },
  productImage: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  deliveryAddress: {
    street: { type: String, default: 'Plot 42, APMC Market Yard' },
    city: { type: String, default: 'Pune' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, default: '411037' }
  },
  paymentMethod: {
    type: String,
    default: 'Escrow Secured'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Escrow Secured', 'Completed', 'Refunded'],
    default: 'Escrow Secured'
  },
  trackingSteps: [
    {
      title: String,
      time: String,
      completed: Boolean
    }
  ],
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  },
  rejectionReason: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
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
  productTitle: {
    type: String,
    required: true
  },
  productImage: String,
  quantity: {
    type: Number,
    required: true
  },
  originalPricePerKg: {
    type: Number,
    required: true
  },
  offeredPricePerKg: {
    type: Number,
    required: true
  },
  counterPricePerKg: {
    type: Number
  },
  agreedPricePerKg: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Countered', 'Rejected', 'Ordered', 'Completed'],
    default: 'Pending'
  },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      senderName: String,
      senderRole: String,
      text: String,
      proposedPrice: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Negotiation', negotiationSchema);

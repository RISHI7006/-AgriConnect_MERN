const express = require('express');
const router = express.Router();
const Negotiation = require('../models/Negotiation');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create negotiation offer
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity, offeredPricePerKg, message } = req.body;

    const product = await Product.findById(productId).populate('farmer');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const negotiation = await Negotiation.create({
      product: product._id,
      buyer: req.user._id,
      farmer: product.farmer._id,
      productTitle: product.title,
      productImage: product.images && product.images.length ? product.images[0] : '',
      quantity: Number(quantity),
      originalPricePerKg: product.pricePerKg,
      offeredPricePerKg: Number(offeredPricePerKg),
      status: 'Pending',
      messages: [
        {
          senderId: req.user._id,
          senderName: req.user.name,
          senderRole: req.user.role,
          text: message || `I would like to order ${quantity} kg at ₹${offeredPricePerKg}/kg.`,
          proposedPrice: Number(offeredPricePerKg)
        }
      ]
    });

    res.status(201).json(negotiation);
  } catch (error) {
    console.error('Negotiation creation error:', error);
    res.status(500).json({ message: 'Error initiating negotiation', error: error.message });
  }
});

// Get user's negotiations
router.get('/my-negotiations', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'farmer') {
      query = { farmer: req.user._id };
    } else {
      query = { buyer: req.user._id };
    }

    const negotiations = await Negotiation.find(query)
      .populate('buyer', 'name phone location rating avatar')
      .populate('farmer', 'name phone location rating avatar')
      .populate('product', 'title category pricePerKg images')
      .sort({ updatedAt: -1 });

    res.json(negotiations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching negotiations' });
  }
});

// Reply or update negotiation (Counter offer, Accept, Reject)
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { action, counterPrice, message } = req.body; // action: 'accept', 'counter', 'reject'
    const negotiation = await Negotiation.findById(req.params.id);

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    if (action === 'accept') {
      const agreed = (negotiation.status === 'Countered' && negotiation.counterPricePerKg)
        ? negotiation.counterPricePerKg
        : negotiation.offeredPricePerKg;
      negotiation.agreedPricePerKg = agreed;
      negotiation.status = 'Accepted';
      negotiation.messages.push({
        senderId: req.user._id,
        senderName: req.user.name,
        senderRole: req.user.role,
        text: message || `Offer accepted at ₹${agreed}/kg. Ready for buyer checkout!`,
        proposedPrice: agreed
      });
    } else if (action === 'counter') {
      negotiation.status = 'Countered';
      negotiation.counterPricePerKg = Number(counterPrice);
      negotiation.messages.push({
        senderId: req.user._id,
        senderName: req.user.name,
        senderRole: req.user.role,
        text: message || `Counter-offer proposed at ₹${counterPrice}/kg.`,
        proposedPrice: Number(counterPrice)
      });
    } else if (action === 'reject') {
      negotiation.status = 'Rejected';
      negotiation.messages.push({
        senderId: req.user._id,
        senderName: req.user.name,
        senderRole: req.user.role,
        text: message || 'Offer declined.'
      });
    }

    await negotiation.save();
    res.json(negotiation);
  } catch (error) {
    res.status(500).json({ message: 'Error processing negotiation response' });
  }
});

module.exports = router;

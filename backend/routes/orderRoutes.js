const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Negotiation = require('../models/Negotiation');
const { protect } = require('../middleware/auth');

// Create new direct order
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress, paymentMethod, notes, customPricePerKg, negotiationId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantityAvailable < quantity) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }

    const pricePerKg = Number(customPricePerKg) > 0 ? Number(customPricePerKg) : product.pricePerKg;
    const totalPrice = pricePerKg * quantity;

    const order = await Order.create({
      buyer: req.user._id,
      farmer: product.farmer,
      product: product._id,
      productTitle: product.title,
      productImage: product.images && product.images.length ? product.images[0] : '',
      quantity,
      unit: product.unit || 'kg',
      pricePerKg,
      totalPrice,
      status: 'Pending',
      deliveryAddress: deliveryAddress || {
        street: 'Market Road, Shop 14',
        city: req.user.location?.city || 'Pune',
        state: req.user.location?.state || 'Maharashtra',
        pincode: '411037'
      },
      paymentMethod: paymentMethod || 'Escrow Secured',
      paymentStatus: 'Escrow Secured',
      notes,
      trackingSteps: [
        { title: 'Order Placed & Escrow Secured', time: 'Just now', completed: true },
        { title: 'Farmer Confirmed Harvest', time: 'Pending confirmation', completed: false },
        { title: 'Dispatched for Transit', time: 'Awaiting dispatch', completed: false },
        { title: 'Delivered to Buyer', time: 'Estimated 2 days', completed: false }
      ]
    });

    // Update product stock
    product.quantityAvailable -= quantity;
    if (product.quantityAvailable <= 0) {
      product.inStock = false;
      product.quantityAvailable = 0;
    }
    await product.save();

    // If order was generated from a negotiation, update negotiation status
    if (negotiationId) {
      await Negotiation.findByIdAndUpdate(negotiationId, {
        status: 'Ordered',
        $push: {
          messages: {
            senderId: req.user._id,
            senderName: req.user.name,
            senderRole: req.user.role,
            text: `Order placed successfully at negotiated price ₹${pricePerKg}/kg (${quantity} kg)!`
          }
        }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get orders for current user (Buyer or Farmer)
router.get('/my-orders', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'farmer') {
      filter = { farmer: req.user._id };
    } else {
      filter = { buyer: req.user._id };
    }

    const orders = await Order.find(filter)
      .populate('buyer', 'name phone location email')
      .populate('farmer', 'name phone location rating avatar')
      .populate('product', 'title category images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders' });
  }
});

// Update order status (Farmer, Buyer or Admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;

    if (rejectionReason) {
      order.rejectionReason = rejectionReason;
    }

    if (status === 'Confirmed') {
      if (order.trackingSteps && order.trackingSteps[1]) {
        order.trackingSteps[1].completed = true;
        order.trackingSteps[1].time = 'Farmer Confirmed Harvest';
      }
    } else if (status === 'In Transit') {
      if (order.trackingSteps) {
        if (order.trackingSteps[1]) order.trackingSteps[1].completed = true;
        if (order.trackingSteps[2]) {
          order.trackingSteps[2].completed = true;
          order.trackingSteps[2].time = 'Dispatched from Farm Hub';
        }
      }
    } else if (status === 'Delivered') {
      if (order.trackingSteps) {
        order.trackingSteps.forEach(step => step.completed = true);
        if (order.trackingSteps[3]) {
          order.trackingSteps[3].time = 'Delivered to Destination Yard';
        }
      }
      order.paymentStatus = 'Completed';
    } else if (status === 'Rejected' || status === 'Cancelled') {
      order.paymentStatus = 'Refunded';
      // Restore inventory if previously active
      if (previousStatus !== 'Rejected' && previousStatus !== 'Cancelled') {
        const product = await Product.findById(order.product);
        if (product) {
          product.quantityAvailable += order.quantity;
          product.inStock = true;
          await product.save();
        }
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Submit review for an order
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.review = {
      rating: Number(rating) || 5,
      comment: comment || 'Very good produce quality and timely delivery.',
      createdAt: new Date()
    };

    await order.save();

    // Update farmer's rating in User model
    const User = require('../models/User');
    const farmer = await User.findById(order.farmer);
    if (farmer) {
      const ordersWithReview = await Order.find({ farmer: farmer._id, 'review.rating': { $exists: true } });
      if (ordersWithReview.length > 0) {
        const totalRating = ordersWithReview.reduce((acc, curr) => acc + (curr.review?.rating || 5), 0);
        farmer.rating = parseFloat((totalRating / ordersWithReview.length).toFixed(1));
        await farmer.save();
      }
    }

    res.json({ message: 'Review submitted successfully', order });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Single order with tracking
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone location email')
      .populate('farmer', 'name phone location rating avatar')
      .populate('product', 'title category images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

module.exports = router;

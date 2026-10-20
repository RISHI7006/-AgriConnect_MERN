const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agriconnect_super_secret_jwt_key_2026_dev', {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location, verificationDoc } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isFarmer = role === 'farmer';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'buyer',
      phone: phone || '+91 98765 43210',
      location: location || { city: 'Pune', state: 'Maharashtra' },
      isVerified: !isFarmer, // buyers auto-verified, farmers need verification
      verificationStatus: isFarmer ? 'pending' : 'verified',
      verificationDoc: verificationDoc || (isFarmer ? 'KCC_Aadhaar_Upload.pdf' : undefined)
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phone: user.phone,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phone: user.phone,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      rating: user.rating,
      reviewCount: user.reviewCount,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Current user
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Demo profiles for rapid switching
router.get('/demo-profiles', async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password').limit(3);
    const buyers = await User.find({ role: 'buyer' }).select('-password').limit(3);
    const admin = await User.findOne({ role: 'admin' }).select('-password');

    const farmerProfile = farmers[0] ? { ...farmers[0].toObject(), token: generateToken(farmers[0]._id) } : null;
    const buyerProfile = buyers[0] ? { ...buyers[0].toObject(), token: generateToken(buyers[0]._id) } : null;
    const adminProfile = admin ? { ...admin.toObject(), token: generateToken(admin._id) } : null;

    res.json({
      farmer: farmerProfile,
      buyer: buyerProfile,
      admin: adminProfile,
      allFarmers: farmers,
      allBuyers: buyers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching demo profiles' });
  }
});

// Update profile (avatar, phone, address, bio, name)
router.put('/profile', async (req, res) => {
  try {
    let userId = req.body.userId;
    if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agriconnect_super_secret_jwt_key_2026_dev');
        userId = decoded.id;
      } catch (e) {
        // Token invalid, fall back
      }
    }
    
    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user && req.body.email) {
      user = await User.findOne({ email: req.body.email });
    }
    if (!user && req.body.role) {
      user = await User.findOne({ role: req.body.role });
    }
    if (!user) {
      user = await User.findOne({ role: 'farmer' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.location) {
      user.location = {
        city: req.body.location.city || user.location?.city || 'Nashik',
        state: req.body.location.state || user.location?.state || 'Maharashtra',
        address: req.body.location.address || user.location?.address || ''
      };
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phone: user.phone,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      rating: user.rating,
      reviewCount: user.reviewCount,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;

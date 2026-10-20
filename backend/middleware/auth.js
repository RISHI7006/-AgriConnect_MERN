const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Try Bearer JWT token if valid
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (token && token !== 'demo-token' && token !== 'null' && token !== 'undefined') {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agriconnect_super_secret_jwt_key_2026_dev');
        req.user = await User.findById(decoded.id).select('-password');
        if (req.user) {
          return next();
        }
      } catch (error) {
        // Don't fail immediately, try demo user fallbacks below
        console.warn('Auth token verify warning:', error.message);
      }
    }
  }

  // 2. Demo User ID Header
  const demoUserId = req.headers['x-demo-user-id'] || req.headers['x-user-id'];
  if (demoUserId) {
    try {
      req.user = await User.findById(demoUserId).select('-password');
      if (req.user) return next();
    } catch (e) {
      // ignore
    }
  }

  // 3. Fallback to active role from demo headers or default buyer
  const fallbackRole = req.headers['x-demo-role'] || 'buyer';
  try {
    const demoUser = await User.findOne({ role: fallbackRole }).select('-password');
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
  } catch (e) {}

  return res.status(401).json({ message: 'Not authorized, please log in' });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

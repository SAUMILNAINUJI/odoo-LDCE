const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const secret = process.env.JWT_SECRET || 'globetrotter_secret_key_2026_jwt';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, adminOnly };

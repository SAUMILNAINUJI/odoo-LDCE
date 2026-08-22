const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'globetrotter_secret_key_2026_jwt';
  return jwt.sign({ id: userId, role }, secret, { expiresIn: '7d' });
};

module.exports = generateToken;

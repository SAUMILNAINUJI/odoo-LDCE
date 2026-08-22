const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,20}$/;

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password, phone, city, state, country, additional_info, photo } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    email = String(email).trim().toLowerCase();
    first_name = String(first_name).trim();
    last_name = String(last_name).trim();

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (phone && String(phone).trim() !== '' && !phoneRegex.test(String(phone).trim())) {
      return res.status(400).json({ message: 'Please provide a valid phone number format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists with this email' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name, last_name, email, password: hashedPassword,
      phone: phone || null, city: city || null, state: state || null,
      country: country || null, additional_info: additional_info || null,
      photo: photo || null
    });

    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      state: user.state,
      country: user.country,
      photo: user.photo,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    email = String(email).trim().toLowerCase();

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      state: user.state,
      country: user.country,
      role: user.role,
      photo: user.photo,
      token: generateToken(user.id, user.role)
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Unable to sign in right now. Please try again.' });
  }
};

module.exports = { registerUser, loginUser };

const bcrypt = require('bcryptjs');
const { User } = require('../models');

// @desc Get logged-in user's profile
// @route GET /api/users/profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc Update profile
// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,20}$/;
    if (req.body.phone && String(req.body.phone).trim() !== '' && !phoneRegex.test(String(req.body.phone).trim())) {
      return res.status(400).json({ message: 'Please provide a valid phone number format' });
    }
    if (req.body.first_name !== undefined && String(req.body.first_name).trim() === '') {
      return res.status(400).json({ message: 'First name cannot be empty' });
    }
    if (req.body.last_name !== undefined && String(req.body.last_name).trim() === '') {
      return res.status(400).json({ message: 'Last name cannot be empty' });
    }

    const fields = ['first_name', 'last_name', 'phone', 'city', 'country', 'additional_info', 'photo'];
    fields.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });

    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete account
// @route DELETE /api/users/profile
const deleteProfile = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update user role (Admin only)
// @route PUT /api/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot change your own role' });
    if (req.body.role && ['admin', 'user'].includes(req.body.role)) {
      user.role = req.body.role;
    }
    await user.save();
    res.json({ message: 'User role updated successfully', role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile, updateUserRole };

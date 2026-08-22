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

    const fields = ['first_name', 'last_name', 'phone', 'city', 'country', 'additional_info', 'photo'];
    fields.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });

    if (req.body.password) {
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

module.exports = { getProfile, updateProfile, deleteProfile };

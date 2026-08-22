const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, deleteProfile, updateUserRole } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);
router.put('/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;

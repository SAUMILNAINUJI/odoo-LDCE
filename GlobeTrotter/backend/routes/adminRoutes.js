const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getStats, listUsers, deleteUser } = require('../controllers/adminController');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, listUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;

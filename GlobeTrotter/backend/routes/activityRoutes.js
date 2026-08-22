const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getActivities, createActivity } = require('../controllers/activityController');

router.get('/', protect, getActivities);
router.post('/', protect, adminOnly, createActivity);

module.exports = router;

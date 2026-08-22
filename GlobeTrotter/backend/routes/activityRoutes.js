const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getActivities, createActivity } = require('../controllers/activityController');

router.get('/', protect, getActivities);
router.post('/', protect, createActivity);

module.exports = router;

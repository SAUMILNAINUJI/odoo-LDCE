const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTrip, getMyTrips, getTripById, updateTrip, deleteTrip,
  addStop, updateStop, deleteStop,
  addStopActivity, deleteStopActivity,
  getTripBudget, getPublicTrip
} = require('../controllers/tripController');

// Public route (no auth) - must be before /:id
router.get('/public/:token', getPublicTrip);

router.post('/', protect, createTrip);
router.get('/', protect, getMyTrips);
router.get('/:id', protect, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

router.get('/:id/budget', protect, getTripBudget);

router.post('/:id/stops', protect, addStop);
router.put('/stops/:stopId', protect, updateStop);
router.delete('/stops/:stopId', protect, deleteStop);

router.post('/stops/:stopId/activities', protect, addStopActivity);
router.delete('/stops/activities/:activityEntryId', protect, deleteStopActivity);

module.exports = router;

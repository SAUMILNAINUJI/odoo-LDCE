const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { listFavorites, toggleFavorite, listReviews, createReview, listPointsOfInterest } = require('../controllers/discoveryController');

router.get('/favorites', protect, listFavorites);
router.post('/favorites', protect, toggleFavorite);
router.get('/cities/:cityId/points-of-interest', protect, listPointsOfInterest);
router.get('/reviews/:id', protect, listReviews);
router.post('/reviews/:id', protect, createReview);

module.exports = router;

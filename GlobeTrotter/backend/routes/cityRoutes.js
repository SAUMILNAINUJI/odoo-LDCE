const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCities, getCityById, createCity } = require('../controllers/cityController');

router.get('/', protect, getCities);
router.get('/:id', protect, getCityById);
router.post('/', protect, createCity);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getCities, getCityById, createCity } = require('../controllers/cityController');

router.get('/', getCities);
router.get('/:id', getCityById);
router.post('/', protect, adminOnly, createCity);

module.exports = router;

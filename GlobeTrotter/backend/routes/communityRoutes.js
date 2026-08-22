const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getFeed, createPost, likePost } = require('../controllers/communityController');

router.get('/', protect, getFeed);
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);

module.exports = router;

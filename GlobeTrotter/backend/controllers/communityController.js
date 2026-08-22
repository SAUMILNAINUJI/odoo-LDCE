const { CommunityPost, User, Trip } = require('../models');

// @desc Get community feed
// @route GET /api/community
const getFeed = async (req, res) => {
  try {
    const posts = await CommunityPost.findAll({
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name', 'photo'] },
        { model: Trip, attributes: ['id', 'name', 'cover_photo'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a community post
// @route POST /api/community
const createPost = async (req, res) => {
  try {
    const { content, trip_id } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const post = await CommunityPost.create({ user_id: req.user.id, trip_id, content });
    const full = await CommunityPost.findByPk(post.id, {
      include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'photo'] }, { model: Trip }]
    });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Like a post
// @route PUT /api/community/:id/like
const likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likes_count += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFeed, createPost, likePost };

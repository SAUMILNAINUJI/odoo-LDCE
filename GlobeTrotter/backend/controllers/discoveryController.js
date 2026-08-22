const { Op } = require('sequelize');
const { Favorite, Review, PointOfInterest, City, Activity } = require('../models');

const listFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']] });
  const cities = await City.findAll({ where: { id: favorites.filter(item => item.entity_type === 'city').map(item => item.entity_id) } });
  const activities = await Activity.findAll({ where: { id: favorites.filter(item => item.entity_type === 'activity').map(item => item.entity_id) } });
  res.json(favorites.map(item => ({ ...item.toJSON(), item: item.entity_type === 'city' ? cities.find(city => city.id === item.entity_id) : activities.find(activity => activity.id === item.entity_id) })));
};

const toggleFavorite = async (req, res) => {
  const { entity_type, entity_id } = req.body;
  if (!['city', 'activity'].includes(entity_type) || !Number(entity_id)) return res.status(400).json({ message: 'A valid city or activity is required' });
  const Model = entity_type === 'city' ? City : Activity;
  if (!await Model.findByPk(entity_id)) return res.status(404).json({ message: 'Item not found' });
  const existing = await Favorite.findOne({ where: { user_id: req.user.id, entity_type, entity_id } });
  if (existing) { await existing.destroy(); return res.json({ saved: false }); }
  await Favorite.create({ user_id: req.user.id, entity_type, entity_id });
  res.status(201).json({ saved: true });
};

const listReviews = async (req, res) => {
  const reviews = await Review.findAll({ where: { entity_type: req.query.entity_type || 'city', entity_id: req.params.id }, include: [{ model: require('../models').User, attributes: ['first_name', 'last_name'] }], order: [['created_at', 'DESC']], limit: 20 });
  res.json(reviews);
};

const createReview = async (req, res) => {
  const { entity_type, rating, comment } = req.body;
  if (!['city', 'activity'].includes(entity_type) || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || !String(comment || '').trim()) return res.status(400).json({ message: 'Entity, rating from 1 to 5, and comment are required' });
  const Model = entity_type === 'city' ? City : Activity;
  if (!await Model.findByPk(req.params.id)) return res.status(404).json({ message: 'Item not found' });
  const review = await Review.create({ user_id: req.user.id, entity_type, entity_id: req.params.id, rating, comment: String(comment).trim() });
  res.status(201).json(review);
};

const listPointsOfInterest = async (req, res) => {
  const where = { city_id: req.params.cityId };
  if (req.query.type) where.type = req.query.type;
  if (req.query.search) where.name = { [Op.like]: `%${req.query.search}%` };
  const points = await PointOfInterest.findAll({ where, order: [['rating', 'DESC']] });
  res.json(points.map(point => ({ ...point.toJSON(), price: Number(point.price || 0) })));
};

module.exports = { listFavorites, toggleFavorite, listReviews, createReview, listPointsOfInterest };

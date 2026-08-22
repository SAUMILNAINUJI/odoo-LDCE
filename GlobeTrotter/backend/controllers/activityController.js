const { Op } = require('sequelize');
const { Activity, City } = require('../models');

// @desc Search activities by city / category / cost
// @route GET /api/activities?city_id=&category=&search=&maxCost=
const getActivities = async (req, res) => {
  try {
    const { city_id, category, search, maxCost } = req.query;
    const where = {};
    if (city_id) where.city_id = city_id;
    if (category) where.category = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (maxCost) where.cost = { [Op.lte]: maxCost };

    const activities = await Activity.findAll({
      where,
      include: [{ model: City, attributes: ['id', 'name', 'country'] }],
      order: [['cost', 'ASC']]
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getActivities, createActivity };

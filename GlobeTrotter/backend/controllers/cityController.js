const { Op } = require('sequelize');
const { City } = require('../models');

// @desc Search / list cities
// @route GET /api/cities?search=&country=&sort=
const getCities = async (req, res) => {
  try {
    const { search, country, sort } = req.query;
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (country) where.country = country;

    let order = [['popularity', 'DESC']];
    if (sort === 'cost_asc') order = [['cost_index', 'ASC']];
    if (sort === 'cost_desc') order = [['cost_index', 'DESC']];
    if (sort === 'name') order = [['name', 'ASC']];

    const cities = await City.findAll({ where, order });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCityById = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCities, getCityById, createCity };

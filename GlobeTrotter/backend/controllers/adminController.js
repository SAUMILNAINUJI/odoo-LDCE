const { User, Trip, City, Activity, Stop } = require('../models');
const { sequelize } = require('../config/db');

// @desc Admin dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTrips = await Trip.count();
    const totalCities = await City.count();
    const totalActivities = await Activity.count();

    const popularCities = await Stop.findAll({
      attributes: ['city_id', [sequelize.fn('COUNT', sequelize.col('Stop.id')), 'visits']],
      include: [{ model: City, attributes: ['name', 'country'] }],
      group: ['city_id', 'City.id'],
      order: [[sequelize.literal('visits'), 'DESC']],
      limit: 5
    });

    const tripsByStatus = await Trip.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status']
    });

    const dateFormat = sequelize.getDialect() === 'mysql'
      ? sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')
      : sequelize.fn('strftime', '%Y-%m', sequelize.col('created_at'));
    const [growthTrips, growthUsers, usersByCountry] = await Promise.all([
      Trip.findAll({
        attributes: [[dateFormat, 'month'], [sequelize.fn('COUNT', sequelize.col('id')), 'trips']],
        group: [dateFormat],
        order: [[dateFormat, 'ASC']]
      }),
      User.findAll({
        attributes: [[dateFormat, 'month'], [sequelize.fn('COUNT', sequelize.col('id')), 'users']],
        group: [dateFormat],
        order: [[dateFormat, 'ASC']]
      }),
      User.findAll({
        attributes: ['country', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['country'],
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ]);

    const growthByMonth = new Map();
    growthTrips.forEach(row => {
      const month = row.get('month');
      if (month) growthByMonth.set(month, { month, trips: Number(row.get('trips')) });
    });
    growthUsers.forEach(row => {
      const month = row.get('month');
      if (month) growthByMonth.set(month, { ...(growthByMonth.get(month) || { month }), users: Number(row.get('users')) });
    });

    res.json({ totalUsers, totalTrips, totalCities, totalActivities, popularCities, tripsByStatus, growthTrend: Array.from(growthByMonth.values()), usersByCountry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Manage users - list all
// @route GET /api/admin/users
const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['created_at', 'DESC']] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, listUsers, deleteUser };

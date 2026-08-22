const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  category: {
    type: DataTypes.ENUM('sightseeing', 'food', 'adventure', 'transport', 'stay', 'other'),
    defaultValue: 'other'
  },
  cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  duration_hours: { type: DataTypes.DECIMAL(4, 1), defaultValue: 1 },
  description: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING(500) }
}, { tableName: 'activities', updatedAt: false });

module.exports = Activity;

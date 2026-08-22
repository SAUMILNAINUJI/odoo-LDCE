const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const City = sequelize.define('City', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  country: { type: DataTypes.STRING(120), allowNull: false },
  cost_index: { type: DataTypes.INTEGER, defaultValue: 50 },
  popularity: { type: DataTypes.INTEGER, defaultValue: 50 },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 4.0 },
  tags: { type: DataTypes.STRING(500), defaultValue: '' },
  family_friendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  couple_friendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  child_friendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  recommended_duration: { type: DataTypes.INTEGER, defaultValue: 3 },
  travel_tip: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING(500) },
  description: { type: DataTypes.TEXT }
}, { tableName: 'cities', updatedAt: false });

module.exports = City;

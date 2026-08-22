const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('PointOfInterest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('hotel', 'restaurant', 'transport'), allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  price_tier: { type: DataTypes.STRING(50) },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 4.0 },
  distance_km: { type: DataTypes.DECIMAL(5, 2) },
  amenities: { type: DataTypes.STRING(500) },
  image_url: { type: DataTypes.STRING(500) }
}, { tableName: 'points_of_interest', updatedAt: false });

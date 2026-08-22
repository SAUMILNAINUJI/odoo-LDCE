const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  entity_type: { type: DataTypes.ENUM('city', 'activity'), allowNull: false },
  entity_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'favorites', indexes: [{ unique: true, fields: ['user_id', 'entity_type', 'entity_id'] }] });

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Stop = sequelize.define('Stop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trip_id: { type: DataTypes.INTEGER, allowNull: false },
  city_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATEONLY },
  end_date: { type: DataTypes.DATEONLY },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  budget: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
}, { tableName: 'stops', updatedAt: false });

module.exports = Stop;

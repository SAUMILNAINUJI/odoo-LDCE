const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StopActivity = sequelize.define('StopActivity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  stop_id: { type: DataTypes.INTEGER, allowNull: false },
  activity_id: { type: DataTypes.INTEGER, allowNull: false },
  day_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  time_slot: { type: DataTypes.STRING(50) },
  cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  notes: { type: DataTypes.TEXT },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'stop_activities', timestamps: false });

module.exports = StopActivity;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trip = sequelize.define('Trip', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  start_date: { type: DataTypes.DATEONLY },
  end_date: { type: DataTypes.DATEONLY },
  cover_photo: { type: DataTypes.STRING(500) },
  status: { type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'), defaultValue: 'upcoming' },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: false },
  share_token: { type: DataTypes.STRING(64), unique: true }
}, { tableName: 'trips' });

module.exports = Trip;

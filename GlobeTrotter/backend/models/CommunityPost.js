const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CommunityPost = sequelize.define('CommunityPost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  trip_id: { type: DataTypes.INTEGER },
  content: { type: DataTypes.TEXT, allowNull: false },
  likes_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'community_posts', updatedAt: false });

module.exports = CommunityPost;

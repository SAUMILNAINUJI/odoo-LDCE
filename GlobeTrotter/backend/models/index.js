const { sequelize } = require('../config/db');
const User = require('./User');
const City = require('./City');
const Activity = require('./Activity');
const Trip = require('./Trip');
const Stop = require('./Stop');
const StopActivity = require('./StopActivity');
const CommunityPost = require('./CommunityPost');

// Associations
User.hasMany(Trip, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'user_id' });

Trip.hasMany(Stop, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
Stop.belongsTo(Trip, { foreignKey: 'trip_id' });

City.hasMany(Stop, { foreignKey: 'city_id' });
Stop.belongsTo(City, { foreignKey: 'city_id' });

City.hasMany(Activity, { foreignKey: 'city_id', onDelete: 'CASCADE' });
Activity.belongsTo(City, { foreignKey: 'city_id' });

Stop.hasMany(StopActivity, { foreignKey: 'stop_id', onDelete: 'CASCADE' });
StopActivity.belongsTo(Stop, { foreignKey: 'stop_id' });

Activity.hasMany(StopActivity, { foreignKey: 'activity_id' });
StopActivity.belongsTo(Activity, { foreignKey: 'activity_id' });

User.hasMany(CommunityPost, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CommunityPost.belongsTo(User, { foreignKey: 'user_id' });

Trip.hasMany(CommunityPost, { foreignKey: 'trip_id' });
CommunityPost.belongsTo(Trip, { foreignKey: 'trip_id' });

module.exports = { sequelize, User, City, Activity, Trip, Stop, StopActivity, CommunityPost };

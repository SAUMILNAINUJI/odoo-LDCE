const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'globetrotter',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Jaydip@2006',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully via Sequelize');
  } catch (err) {
    console.error('Unable to connect to MySQL:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

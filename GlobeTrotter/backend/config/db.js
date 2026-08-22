const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Determine dialect dynamically based on available configuration (default to mysql)
const dialect = process.env.DB_DIALECT || 'mysql';

const sequelize = dialect === 'mysql' ? new Sequelize(
  process.env.DB_NAME || 'globetrotter',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Jaydip@2006',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: { underscored: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
  }
) : new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
  define: { underscored: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully via ${sequelize.getDialect().toUpperCase()}`);
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

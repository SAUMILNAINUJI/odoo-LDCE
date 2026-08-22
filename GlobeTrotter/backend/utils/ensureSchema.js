const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const cityColumns = {
  rating: 'DECIMAL(2,1) DEFAULT 4.0',
  tags: "VARCHAR(500) DEFAULT ''",
  family_friendly: 'TINYINT(1) DEFAULT 0',
  couple_friendly: 'TINYINT(1) DEFAULT 0',
  child_friendly: 'TINYINT(1) DEFAULT 0',
  recommended_duration: 'INTEGER DEFAULT 3'
  ,travel_tip: 'TEXT'
};

const tableColumns = {
  cities: cityColumns,
  trips: { budget: 'DECIMAL(12,2) DEFAULT 0' }
};

const ensureSchema = async () => {
  if (sequelize.getDialect() !== 'sqlite') return;
  for (const [table, columns] of Object.entries(tableColumns)) {
    const existing = await sequelize.query(`PRAGMA table_info(${table})`, { type: QueryTypes.SELECT });
    const existingNames = new Set(existing.map(column => column.name));
    for (const [name, definition] of Object.entries(columns)) {
      if (!existingNames.has(name)) {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
      }
    }
  }
};

module.exports = ensureSchema;

require('./config');
const { Sequelize } = require('sequelize');
// Sequelize traduce las operaciones de modelos a SQL. Las credenciales vienen de .env.
const sequelize = new Sequelize(process.env.DB_NAME || 'api_news_curso', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql', logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {},
});
module.exports = sequelize;

require('dotenv').config({ quiet: true });
const crypto = require('node:crypto');
const production = process.env.NODE_ENV === 'production';
if (production && !process.env.JWT_SECRET) throw new Error('Configura JWT_SECRET en el alojamiento.');
module.exports = {
  port: Number(process.env.PORT || 3100), production,
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex'),
  jwtExpires: process.env.JWT_EXPIRES_IN || '1h',
  seedDemo: process.env.SEED_DEMO === 'true',
  adminPassword: process.env.DEMO_ADMIN_PASSWORD,
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
};

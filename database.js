// database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
 ssl: {
    rejectUnauthorized: false, // ✅ Required by Render PostgreSQL
  },
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL DB'))
  .catch((err) => console.error('DB connection error', err));

module.exports = pool;

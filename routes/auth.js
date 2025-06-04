const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /auth/admin-login
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing credentials');
  }

  try {
    const result = await db.query(
      'SELECT id, name FROM admins WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    res.json({ admin_id: result.rows[0].id, name: result.rows[0].name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin login failed');
  }
});


// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing credentials');
  }

  try {
    const result = await db.query(
      'SELECT id, name FROM drivers WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    res.json({ driver_id: result.rows[0].id, name: result.rows[0].name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed');
  }
});

module.exports = router;

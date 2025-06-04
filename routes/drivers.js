const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// POST a new driver
router.post('/', async (req, res) => {
  const { name, address, phone, license_number, username, password} = req.body;

  if (!name || !phone || !license_number) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const result = await db.query(
      `INSERT INTO drivers (name, address, phone, license_number,  username, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, address, phone, license_number, username, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating driver');
  }
});

// PUT /drivers/:id — update a driver
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, license_number, username, password } = req.body;

  try {
    const result = await db.query(
      `UPDATE drivers
       SET name = $1, address = $2, phone = $3, license_number = $4, username = $5, password = $6
       WHERE id = $7
       RETURNING *`,
      [name, address, phone, license_number, username, password, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Driver not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating driver');
  }
});


// DELETE /drivers/:id — delete a driver
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM drivers WHERE id = $1', [id]);
    res.status(204).send(); // success, no content
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting driver');
  }
});

module.exports = router;

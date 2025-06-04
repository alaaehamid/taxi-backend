const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all cars
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// POST a new car
router.post('/', async (req, res) => {
  const { license_plate, make, model, year } = req.body;

  if (!license_plate) {
    return res.status(400).send('License plate is required');
  }

  try {
    const result = await db.query(
      `INSERT INTO cars (license_plate, make, model, year)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [license_plate, make, model, year]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating car');
  }
});

// PUT /cars/:id — update a car
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { license_plate, make, model, year } = req.body;

  try {
    const result = await db.query(
      `UPDATE cars
       SET license_plate = $1, make = $2, model = $3, year = $4
       WHERE id = $5
       RETURNING *`,
      [license_plate, make, model, year, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Car not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating car');
  }
});

// DELETE /cars/:id — delete a car
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM cars WHERE id = $1', [id]);
    res.status(204).send(); // success, no content
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).send('Error deleting car');
  }
});


module.exports = router;

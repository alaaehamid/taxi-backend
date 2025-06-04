const express = require('express');
const router = express.Router();
const db = require('../database');

// Start a shift
router.post('/start', async (req, res) => {
  const { driver_id, car_id } = req.body;

  if (!driver_id || !car_id) {
    return res.status(400).send('Missing driver_id or car_id');
  }

  try {
    const result = await db.query(
      `INSERT INTO shifts (driver_id, car_id, start_time)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [driver_id, car_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error starting shift');
  }
});

// End a shift
router.post('/end', async (req, res) => {
  const { shift_id } = req.body;

  if (!shift_id) {
    return res.status(400).send('Missing shift_id');
  }

  try {
    const result = await db.query(
      `UPDATE shifts
       SET end_time = NOW()
       WHERE id = $1
       RETURNING *`,
      [shift_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Shift not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error ending shift');
  }
});

// Get all shifts for a driver
router.get('/:driverId', async (req, res) => {
  const { driverId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM shifts WHERE driver_id = $1 ORDER BY start_time DESC`,
      [driverId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching shifts');
  }
});

// GET /shifts — Admin: fetch all shifts with driver names
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, d.name AS driver_name
      FROM shifts s
      JOIN drivers d ON s.driver_id = d.id
      ORDER BY s.start_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching all shifts');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /expenses — log an expense
router.post('/', async (req, res) => {
  const { driver_id, car_id, amount, description, type } = req.body;

  if (!driver_id || !amount || !description || !type) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const result = await db.query(
      `INSERT INTO expenses (driver_id, car_id, amount, description, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [driver_id, car_id || null, amount, description, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving expense');
  }
});

// GET /expenses/:driverId — get all expenses for a driver
router.get('/:driverId', async (req, res) => {
  const { driverId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM expenses
       WHERE driver_id = $1
       ORDER BY timestamp DESC`,
      [driverId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching expenses');
  }
});

// GET /expenses/all — admin: all expenses
// GET /expenses — admin: filter by date
// GET /expenses — admin: supports optional ?type=...&from=...&to=...
router.get('/', async (req, res) => {
  const { type, from, to } = req.query;
  const values = [];
  let query = 'SELECT * FROM expenses';
  const conditions = [];

  if (type && type !== 'all') {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (from && to) {
    values.push(from);
    values.push(to);
    conditions.push(`timestamp BETWEEN $${values.length - 1} AND $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY timestamp DESC';

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).send('Database error');
  }
});


// GET /expenses/driver/:id — filter by driver + date
router.get('/driver/:id', async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;

  try {
    let query = 'SELECT * FROM expenses WHERE driver_id = $1';
    const values = [id];

    if (from && to) {
      query += ' AND timestamp BETWEEN $2 AND $3 ORDER BY timestamp DESC';
      values.push(from, to);
    } else {
      query += ' ORDER BY timestamp DESC';
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching driver expenses');
  }
});


module.exports = router;

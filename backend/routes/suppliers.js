// backend/routes/suppliers.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');


// GET all suppliers created by the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM suppliers WHERE created_by = $1', [req.user.user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /suppliers error:', err.message);
    res.status(500).send('Error fetching suppliers');
  }
});

// POST a new supplier
router.post('/', authenticateToken, async (req, res) => {
  const { name, contact_info, reliability_score } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO suppliers (name, contact_info, reliability_score, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, contact_info, reliability_score, req.user.user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /suppliers error:', err.message);
    res.status(500).send('Error adding supplier');
  }
});

// DELETE supplier by ID and created_by
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM suppliers WHERE supplier_id = $1 AND created_by = $2', [id, req.user.user_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /suppliers error:', err.message);
    res.status(500).send('Error deleting supplier');
  }
});

module.exports = router;

// backend/routes/pending.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

console.log('pending.js loaded');

// GET all pending inventory items for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM pending_inventory WHERE created_by = $1',
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /pending error:', err.message);
    res.status(500).send('Error fetching pending inventory');
  }
});

// POST a new pending inventory item
router.post('/', authenticateToken, async (req, res) => {
  const { order_id, product_id, quantity_ordered, quantity_received } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO pending_inventory (order_id, product_id, quantity_ordered, quantity_received, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [order_id, product_id, quantity_ordered, quantity_received, req.user.user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /pending error:', err.message);
    res.status(500).send('Error adding pending inventory');
  }
});

// DELETE a pending inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM pending_inventory WHERE pending_id = $1 AND created_by = $2', [id, req.user.user_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /pending error:', err.message);
    res.status(500).send('Error deleting pending inventory');
  }
});

module.exports = router;

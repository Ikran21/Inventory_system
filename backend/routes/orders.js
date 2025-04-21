const express = require('express');
const db = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// Get orders for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE created_by = $1 ORDER BY order_id DESC',
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  const { product_id, supplier_id, date_ordered, expected_arrival, status } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO orders (product_id, supplier_id, date_ordered, expected_arrival, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [product_id, supplier_id, date_ordered, expected_arrival, status, req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /orders error:', err.message);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

// Delete
router.delete('/:id', authenticateToken, async (req, res) => {
  const orderId = req.params.id;
  try {
    await db.query(
      `DELETE FROM orders WHERE order_id = $1 AND created_by = $2`,
      [orderId, req.user.user_id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /orders error:', err.message);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;

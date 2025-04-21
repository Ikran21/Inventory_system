const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// GET /api/alerts/low-stock
router.get('/low-stock', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const result = await db.query(
      'SELECT * FROM products WHERE quantity_in_stock < 5 AND created_by = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /alerts/low-stock error:', err.message);
    res.status(500).send('Error fetching low-stock alerts');
  }
});

module.exports = router;

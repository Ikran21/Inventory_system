const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// GET /api/analytics
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Total product count
    const totalRes = await db.query(
      'SELECT COUNT(*) FROM products WHERE created_by = $1',
      [userId]
    );

    // Average quantity in stock
    const avgRes = await db.query(
      'SELECT AVG(quantity_in_stock) FROM products WHERE created_by = $1',
      [userId]
    );

    // Low stock alerts (<10 units)
    const lowStockRes = await db.query(
      'SELECT * FROM products WHERE created_by = $1 AND quantity_in_stock < 10',
      [userId]
    );

    // Supplier performance analytics
    const supplierPerfRes = await db.query(
      `SELECT 
         s.name AS supplier_name,
         COUNT(o.order_id) AS total_orders,
         ROUND(AVG(EXTRACT(DAY FROM o.expected_arrival::timestamp - o.date_ordered::timestamp))) AS avg_delay
       FROM suppliers s
       JOIN orders o ON s.supplier_id = o.supplier_id
       WHERE o.created_by = $1
       GROUP BY s.name`,
      [userId]
    );

    const totalProducts = parseInt(totalRes.rows[0].count, 10);
    const avgQuantity = parseFloat(avgRes.rows[0].avg) || 0;
    const lowStock = lowStockRes.rows;
    const supplierPerformance = supplierPerfRes.rows;

    res.json({
      analytics: {
        totalProducts,
        avgQuantity: parseFloat(avgQuantity.toFixed(2))
      },
      lowStock,
      supplierPerformance,
      overdueOrders: [] // Placeholder if needed later
    });
  } catch (err) {
    console.error('GET /analytics error:', err.message);
    res.status(500).send('Error fetching analytics');
  }
});

module.exports = router;

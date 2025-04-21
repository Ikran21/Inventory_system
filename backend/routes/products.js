// backend/routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');


// GET all products for the logged-in user + low-stock alert + analytics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get user's products
    const productRes = await db.query(
      'SELECT * FROM products WHERE created_by = $1',
      [userId]
    );
    const products = productRes.rows;

    // Get pending inventory for this user’s orders
    const pendingRes = await db.query(
      `SELECT pi.product_id, SUM(pi.quantity_ordered - pi.quantity_received) AS still_pending
       FROM pending_inventory pi
       JOIN orders o ON o.order_id = pi.order_id
       WHERE o.created_by = $1
       GROUP BY pi.product_id`,
      [userId]
    );

    // Build a map of pending product adjustments
    const pendingMap = {};
    pendingRes.rows.forEach(row => {
      pendingMap[row.product_id] = parseInt(row.still_pending);
    });

    // Determine low stock (adjusted for pending)
    const lowStock = products.filter(p => {
      const pending = pendingMap[p.product_id] || 0;
      const adjustedStock = p.quantity_in_stock - pending;
      return adjustedStock < 10;
    });

    // Calculate analytics
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + parseInt(p.quantity_in_stock), 0);
    const avgQuantity = totalProducts > 0 ? (totalQuantity / totalProducts).toFixed(2) : 0;

    res.json({
      products,
      lowStock,
      analytics: { totalProducts, avgQuantity }
    });
  } catch (err) {
    console.error('GET /products error:', err.message);
    res.status(500).send('Error fetching products');
  }
});

// POST a new product
router.post('/', authenticateToken, async (req, res) => {
  const { name, sku, description, quantity_in_stock } = req.body;
  const userId = req.user.user_id;

  try {
    const result = await db.query(
      `INSERT INTO products (name, sku, description, quantity_in_stock, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, sku, description, quantity_in_stock, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /products error:', err.message);
    res.status(500).send('Error adding product');
  }
});

// DELETE a product
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;
  try {
    await db.query(
      'DELETE FROM products WHERE product_id = $1 AND created_by = $2',
      [id, userId]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /products error:', err.message);
    res.status(500).send('Error deleting product');
  }
});

module.exports = router;

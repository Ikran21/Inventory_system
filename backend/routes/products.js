const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

// POST a new product
router.post('/', async (req, res) => {
  const { name, sku, description, quantity_in_stock } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, sku, description, quantity_in_stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, sku, description, quantity_in_stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error adding product');
  }
});

module.exports = router;

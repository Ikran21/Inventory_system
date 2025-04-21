// index.js (Backend Entry Point)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());

// Ping route for debugging
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Attach route files
const productsRouter = require('./routes/products');
const suppliersRouter = require('./routes/suppliers');

app.use('/api/products', productsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/orders', require('./routes/orders'));
app.use('/api/pending', require('./routes/pending'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/alerts', require('./routes/alerts'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

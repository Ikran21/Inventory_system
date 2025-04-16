import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Suppliers from './components/Suppliers';
import Orders from './components/Orders';
import PendingInventory from './components/PendingInventory';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', background: '#ddd' }}>
          <Link to="/" style={{ margin: '0 10px' }}>Dashboard</Link>
          <Link to="/products" style={{ margin: '0 10px' }}>Products</Link>
          <Link to="/suppliers" style={{ margin: '0 10px' }}>Suppliers</Link>
          <Link to="/orders" style={{ margin: '0 10px' }}>Orders</Link>
          <Link to="/pending" style={{ margin: '0 10px' }}>Pending Inventory</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/pending" element={<PendingInventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

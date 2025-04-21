import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Products from './components/Products';
import Suppliers from './components/Suppliers';
import Orders from './components/Orders';
import PendingInventory from './components/PendingInventory';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import Logout from './components/auth/Logout';
import Analytics from './components/Analytics';

const isAuthenticated = !!localStorage.getItem('token');

function App() {
  return (
    <Router>
      {isAuthenticated && (
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/pending">Pending Inventory</Link>
          <a href="/analytics">Analytics</a>
          <a href="/logout">Logout</a>
        </nav>
      )}

      <Routes>
        {/* Public */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/pending" element={<PendingInventory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/logout" element={<Logout />} />
          </>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

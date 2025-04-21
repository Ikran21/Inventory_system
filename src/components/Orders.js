import React, { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    supplier_id: '',
    date_ordered: '',
    expected_arrival: '',
    status: 'Pending',
  });
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const API_URL = 'http://localhost:5000/api/orders';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));

    fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error('Error fetching products:', err));

    fetch('http://localhost:5000/api/suppliers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.error('Error fetching suppliers:', err));
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add order');

      const newOrder = await res.json();
      setOrders([...orders, newOrder]);
      setFormData({
        product_id: '',
        supplier_id: '',
        date_ordered: '',
        expected_arrival: '',
        status: 'Pending',
      });
    } catch (err) {
      console.error('Error adding order:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((o) => o.order_id !== id));
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  return (
    <div className="container">
      <h2>Orders</h2>

      <form className="form" onSubmit={handleAddOrder}>
        <div className="form-group">
          <label>Product</label>
          <select name="product_id" value={formData.product_id} onChange={handleChange}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Supplier</label>
          <select name="supplier_id" value={formData.supplier_id} onChange={handleChange}>
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date Ordered</label>
          <input
            type="date"
            name="date_ordered"
            value={formData.date_ordered}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Expected Arrival</label>
          <input
            type="date"
            name="expected_arrival"
            value={formData.expected_arrival}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Received">Received</option>
          </select>
        </div>

        <button className="submit-button" type="submit">
          Add Order
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Supplier</th>
            <th>Date Ordered</th>
            <th>Expected Arrival</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td>{o.product_id}</td>
              <td>{o.supplier_id}</td>
              <td>{o.date_ordered?.split('T')[0]}</td>
              <td>{o.expected_arrival?.split('T')[0]}</td>
              <td>{o.status}</td>
              <td>
                <button
                  onClick={() => handleDelete(o.order_id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

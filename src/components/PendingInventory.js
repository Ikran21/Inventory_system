import React, { useState, useEffect } from 'react';

export default function PendingInventory() {
  const [pendingItems, setPendingItems] = useState([]);
  const [formData, setFormData] = useState({
    order_id: '',
    product_id: '',
    quantity_ordered: '',
    quantity_received: '',
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const API_URL = 'http://localhost:5000/api/pending';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPendingItems(data))
      .catch((err) => console.error('Error fetching pending inventory:', err));

    fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));

    fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Unexpected product response:', data);
        }
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddPending = async (e) => {
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

      if (!res.ok) throw new Error('Failed to add pending item');

      const newItem = await res.json();
      setPendingItems([...pendingItems, newItem]);
      setFormData({ order_id: '', product_id: '', quantity_ordered: '', quantity_received: '' });
    } catch (err) {
      console.error('Error adding pending item:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingItems(pendingItems.filter((item) => item.pending_id !== id));
    } catch (err) {
      console.error('Error deleting pending item:', err);
    }
  };

  return (
    <div className="container">
      <h2>Pending Inventory</h2>

      <form className="form" onSubmit={handleAddPending}>
        <div className="form-group">
          <label>Order</label>
          <select name="order_id" value={formData.order_id} onChange={handleChange}>
            <option value="">Select Order</option>
            {orders.map((o) => (
              <option key={o.order_id} value={o.order_id}>
                Order #{o.order_id}
              </option>
            ))}
          </select>
        </div>
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
          <label>Quantity Ordered</label>
          <input
            type="number"
            name="quantity_ordered"
            value={formData.quantity_ordered}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity Received</label>
          <input
            type="number"
            name="quantity_received"
            value={formData.quantity_received}
            onChange={handleChange}
          />
        </div>
        <button className="submit-button" type="submit">
          Add Pending Item
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Product</th>
            <th>Ordered</th>
            <th>Received</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingItems.map((item) => (
            <tr key={item.pending_id}>
              <td>{item.order_id}</td>
              <td>{item.product_id}</td>
              <td>{item.quantity_ordered}</td>
              <td>{item.quantity_received}</td>
              <td>
                <button
                  onClick={() => handleDelete(item.pending_id)}
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

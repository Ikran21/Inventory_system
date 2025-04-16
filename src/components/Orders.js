import React, { useState } from 'react';


export default function Orders() {
  const [orders, setOrders] = useState([
    { id: 1, product: 'Monitor', status: 'Pending', expected: '2025-04-12' },
    { id: 2, product: 'Mouse', status: 'Received', expected: '2025-03-28' },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    product: '',
    status: 'Pending',
    expected: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrder = (e) => {
    e.preventDefault();
    const { id, product, status, expected } = formData;
    if (!id || !product || !expected) return;
    setOrders([...orders, { id, product, status, expected }]);
    setFormData({ id: '', product: '', status: 'Pending', expected: '' });
  };

  return (
    <div className="container">
      <h2>Orders</h2>

      <form className="form" onSubmit={handleAddOrder}>
        <div className="form-group">
          <label>Order ID</label>
          <input name="id" value={formData.id} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Product</label>
          <input name="product" value={formData.product} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Received">Received</option>
          </select>
        </div>
        <div className="form-group">
          <label>Expected Arrival</label>
          <input
            type="date"
            name="expected"
            value={formData.expected}
            onChange={handleChange}
          />
        </div>
        <button className="submit-button" type="submit">
          Add Order
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Status</th>
            <th>Expected Arrival</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={i}>
              <td>{o.id}</td>
              <td>{o.product}</td>
              <td>{o.status}</td>
              <td>{o.expected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

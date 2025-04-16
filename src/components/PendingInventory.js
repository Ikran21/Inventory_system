import React, { useState } from 'react';

export default function PendingInventory() {
  const [pendingItems, setPendingItems] = useState([
    { product: 'Laptop', quantity: 10, expected: '2025-04-10' },
    { product: 'Keyboard', quantity: 5, expected: '2025-04-15' },
  ]);

  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    expected: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddPending = (e) => {
    e.preventDefault();
    const { product, quantity, expected } = formData;
    if (!product || !quantity || !expected) return;

    setPendingItems([
      ...pendingItems,
      { product, quantity: parseInt(quantity), expected },
    ]);
    setFormData({ product: '', quantity: '', expected: '' });
  };

  return (
    <div className="container">
      <h2>Pending Inventory</h2>

      <form className="form" onSubmit={handleAddPending}>
        <div className="form-group">
          <label>Product</label>
          <input
            name="product"
            value={formData.product}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity Ordered</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Expected Arrival Date</label>
          <input
            type="date"
            name="expected"
            value={formData.expected}
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
            <th>Product</th>
            <th>Quantity</th>
            <th>Expected Arrival</th>
          </tr>
        </thead>
        <tbody>
          {pendingItems.map((item, i) => (
            <tr key={i}>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.expected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

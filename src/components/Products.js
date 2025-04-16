import React, { useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([
    { name: 'Laptop', sku: 'LP001', quantity: 10 },
    { name: 'Keyboard', sku: 'KB002', quantity: 0 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    const { name, sku, quantity } = formData;
    if (!name || !sku || quantity === '') return;

    setProducts([...products, { name, sku, quantity: parseInt(quantity) }]);
    setFormData({ name: '', sku: '', quantity: '' });
  };

  return (
    <div className="container">
      <h2>Product Inventory</h2>

      <form className="form" onSubmit={handleAddProduct}>
        <div className="form-group">
          <label>Product Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>SKU</label>
          <input name="sku" value={formData.sku} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <button className="submit-button" type="submit">
          Add Product
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td style={{ color: p.quantity === 0 ? 'red' : 'black' }}>
                {p.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

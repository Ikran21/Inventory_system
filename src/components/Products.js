
import React, { useState, useEffect } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantity_in_stock: '',
  });

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api/products';

  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error('Error fetching products:', err));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
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
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setFormData({ name: '', sku: '', description: '', quantity_in_stock: '' });
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.product_id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
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
          <label>Description</label>
          <input name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            name="quantity_in_stock"
            type="number"
            value={formData.quantity_in_stock}
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
            <th>Description</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.description}</td>
              <td>{p.quantity_in_stock}</td>
              <td>
                <button
                  onClick={() => handleDelete(p.product_id)}
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

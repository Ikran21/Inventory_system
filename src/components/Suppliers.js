import React, { useState, useEffect } from 'react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    reliability_score: '',
  });

  const API_URL = 'http://localhost:5000/api/suppliers';
  const token = localStorage.getItem('token');

  // Fetch suppliers only created by the current user
  useEffect(() => {
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched suppliers:', data);
        setSuppliers(data);
      })
      .catch((err) => console.error('Error fetching suppliers:', err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSupplier = async (e) => {
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

      if (!res.ok) {
        throw new Error('Failed to add supplier');
      }

      const newSupplier = await res.json();
      setSuppliers([...suppliers, newSupplier]);
      setFormData({ name: '', contact_info: '', reliability_score: '' });
    } catch (err) {
      console.error('Error adding supplier:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(suppliers.filter((s) => s.supplier_id !== id));
    } catch (err) {
      console.error('Error deleting supplier:', err);
    }
  };

  return (
    <div className="container">
      <h2>Suppliers</h2>

      <form className="form" onSubmit={handleAddSupplier}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contact Info</label>
          <input name="contact_info" value={formData.contact_info} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Reliability Score</label>
          <input
            name="reliability_score"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.reliability_score}
            onChange={handleChange}
          />
        </div>
        <button className="submit-button" type="submit">
          Add Supplier
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Reliability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.supplier_id}>
              <td>{s.name}</td>
              <td>{s.contact_info}</td>
              <td>{s.reliability_score}</td>
              <td>
                <button
                  onClick={() => handleDelete(s.supplier_id)}
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

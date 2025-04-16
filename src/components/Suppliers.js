import React, { useState } from 'react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([
    { name: 'TechSource', contact: 'contact@techsource.com', score: 4.5 },
    { name: 'QuickParts', contact: 'sales@quickparts.io', score: 3.9 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    score: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSupplier = (e) => {
    e.preventDefault();
    const { name, contact, score } = formData;
    if (!name || !contact || score === '') return;
    setSuppliers([...suppliers, { name, contact, score: parseFloat(score) }]);
    setFormData({ name: '', contact: '', score: '' });
  };

  return (
    <div className="container">
      <h2>Suppliers</h2>

      <form className="form" onSubmit={handleAddSupplier}>
        <div className="form-group">
          <label>Supplier Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input name="contact" value={formData.contact} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Reliability Score</label>
          <input
            name="score"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.score}
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
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.contact}</td>
              <td>{s.score}/5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

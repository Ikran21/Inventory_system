import React, { useEffect, useState } from 'react';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [supplierPerformance, setSupplierPerformance] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.analytics);
        setSupplierPerformance(data.supplierPerformance || []);

        const productAlerts = data.lowStock.map(
          (p) => `⚠️ Product "${p.name}" is low on stock (${p.quantity_in_stock} left)`
        );

        const orderAlerts = data.overdueOrders.map(
          (o) =>
            `⏰ Order #${o.order_id} for "${o.product_name}" is overdue (Expected ${new Date(
              o.expected_arrival
            ).toLocaleDateString()})`
        );

        setAlerts([...productAlerts, ...orderAlerts]);
      })
      .catch((err) => console.error('Error loading analytics:', err));
  }, [token]);

  return (
    <div className="container">
      <h2>Analytics Overview</h2>

      {analytics && (
        <div style={{ marginBottom: '20px' }}>
          <p>
            Total Products: <strong>{analytics.totalProducts}</strong>
          </p>
          <p>
            Average Quantity in Stock:{' '}
            <strong>{analytics.avgQuantity}</strong>
          </p>
        </div>
      )}

      <h3>Alerts</h3>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p>No alerts at this time.</p>
      )}

      <h3>Supplier Performance</h3>
      {supplierPerformance.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Total Orders</th>
              <th>Avg. Delivery Delay (days)</th>
            </tr>
          </thead>
          <tbody>
            {supplierPerformance.map((s, i) => (
              <tr key={i}>
                <td>{s.supplier_name}</td>
                <td>{s.total_orders}</td>
                <td>{s.avg_delay ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No supplier performance data yet.</p>
      )}
    </div>
  );
}

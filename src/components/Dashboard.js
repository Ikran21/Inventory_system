import inventoryImage from '../assets/inventory.jpg';

export default function Dashboard() {
  return (
    <div className="container">
      <h2>Smart Inventory Dashboard</h2>
      <img src={inventoryImage} alt="Inventory System" style={{ width: '300px', marginTop: '20px' }} />
      <p>Welcome! Here you’ll see inventory summaries, alerts, and pending deliveries.</p>
    </div>
  );
}

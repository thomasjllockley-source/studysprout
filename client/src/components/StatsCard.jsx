export default function StatsCard({ icon, label, value, color = '#667eea' }) {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-info">
        <div className="stats-card-value">{value}</div>
        <div className="stats-card-label">{label}</div>
      </div>
    </div>
  );
}

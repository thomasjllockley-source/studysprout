export default function ProgressBar({ value, max = 100, label, color = '#667eea', showValue = true }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

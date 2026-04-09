import React from 'react';

const MetricCard = ({ title, value, change, changeType, icon, color = 'green' }) => {
  const colorMap = {
    green: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
    blue: { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' }
  };

  const colors = colorMap[color] || colorMap.green;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{
        padding: '0.75rem',
        borderRadius: '12px',
        background: colors.bg,
        color: colors.text,
        fontSize: '1.5rem'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>{value}</h3>
        {change && (
          <p style={{ fontSize: '0.75rem', color: changeType === 'positive' ? '#22c55e' : '#ef4444' }}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

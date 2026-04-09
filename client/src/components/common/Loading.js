import React from 'react';

const Loading = ({ size = 'medium', fullScreen = false }) => {
  const spinnerSizes = {
    small: '24px',
    medium: '40px',
    large: '56px'
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 22, 40, 0.9)',
    zIndex: 9999
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={{
        width: spinnerSizes[size],
        height: spinnerSizes[size],
        border: '3px solid rgba(34, 197, 94, 0.2)',
        borderTopColor: '#22c55e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  );
};

export default Loading;

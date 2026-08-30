import React from 'react'

export const LoadingSpinner = ({ size = '40px', color = '#2563eb', message }) => {
  return (
    <div style={containerStyle}>
      <div style={{
        ...spinnerStyle,
        width: size,
        height: size,
        border: `3px solid rgba(0, 0, 0, 0.05)`,
        borderTopColor: color,
      }} />
      {message && <span style={messageStyle}>{message}</span>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  gap: '12px',
}

const spinnerStyle = {
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

const messageStyle = {
  fontSize: '14px',
  color: '#4b5563',
  fontWeight: 500,
}

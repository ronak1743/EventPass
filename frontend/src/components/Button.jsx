import React from 'react'

export const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, style = {} }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...btnBaseStyle, ...btnVariantStyles[variant], ...style }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = btnHoverColors[variant]
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = btnVariantStyles[variant].backgroundColor
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {children}
    </button>
  )
}

const btnBaseStyle = {
  fontFamily: 'inherit',
  fontWeight: 600,
  fontSize: '14px',
  padding: '10px 18px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 150ms ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
}

const btnVariantStyles = {
  primary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
  },
  danger: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
  },
  success: {
    backgroundColor: '#059669',
    color: '#ffffff',
  },
}

const btnHoverColors = {
  primary: '#1d4ed8',
  secondary: '#f9fafb',
  danger: '#b91c1c',
  success: '#047857',
}

import React from 'react'

export const StatusBadge = ({ status }) => {
  const styles = badgeStyles[status] || badgeStyles.DRAFT

  return (
    <span style={{ ...baseStyle, ...styles }}>
      {status}
    </span>
  )
}

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const badgeStyles = {
  DRAFT: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
  },
  PUBLISHED: {
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
  },
  ARCHIVED: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
  },
}

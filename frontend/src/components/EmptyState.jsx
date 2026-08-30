import React from 'react'
import { Button } from './Button'

export const EmptyState = ({ title = 'No data available', description = 'There are no items to display here.', actionText, onActionClick }) => {
  return (
    <div style={containerStyle} className="fade-in">
      <div style={iconContainerStyle}>
        <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} style={{ marginTop: '8px' }}>
          {actionText}
        </Button>
      )}
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px dashed #d1d5db',
}

const iconContainerStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
}

const iconStyle = {
  width: '28px',
  height: '28px',
  color: '#9ca3af',
}

const titleStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '6px',
}

const descriptionStyle = {
  fontSize: '14px',
  color: '#6b7280',
  maxWidth: '320px',
  marginBottom: '16px',
}

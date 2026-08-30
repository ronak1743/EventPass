import React from 'react'
import { Button } from './Button'

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  if (!isOpen) return null

  return (
    <div style={overlayStyle} className="fade-in">
      <div style={cardStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={messageStyle}>{message}</p>
        <div style={actionStyle}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  maxWidth: '440px',
  width: '100%',
  border: '1px solid #e5e7eb',
}

const titleStyle = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#111827',
  marginBottom: '8px',
}

const messageStyle = {
  fontSize: '14px',
  color: '#4b5563',
  marginBottom: '24px',
  lineHeight: 1.6,
}

const actionStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
}

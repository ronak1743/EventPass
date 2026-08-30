import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((type, message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  const success = useCallback((msg, dur) => toast('success', msg, dur), [toast])
  const error = useCallback((msg, dur) => toast('error', msg, dur), [toast])
  const warning = useCallback((msg, dur) => toast('warning', msg, dur), [toast])
  const info = useCallback((msg, dur) => toast('info', msg, dur), [toast])

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div style={toastContainerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toastStyle, ...toastTypeStyles[t.type] }} className="fade-in">
            <span style={iconStyle}>{toastIcons[t.type]}</span>
            <div style={contentStyle}>{t.message}</div>
            <button onClick={() => removeToast(t.id)} style={closeButtonStyle}>&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const toastContainerStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 9999,
  maxWidth: '380px',
  width: '100%',
}

const toastStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '8px',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.25s ease',
  backgroundColor: '#ffffff',
  color: '#1f2937',
  border: '1px solid #e5e7eb',
}

const toastTypeStyles = {
  success: {
    borderLeft: '4px solid #059669',
    backgroundColor: '#f0fdf4',
    color: '#065f46',
  },
  error: {
    borderLeft: '4px solid #dc2626',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
  },
  warning: {
    borderLeft: '4px solid #d97706',
    backgroundColor: '#fffbeb',
    color: '#92400e',
  },
  info: {
    borderLeft: '4px solid #2563eb',
    backgroundColor: '#eff6ff',
    color: '#1e40af',
  },
}

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const iconStyle = {
  marginRight: '12px',
  fontWeight: 'bold',
  fontSize: '16px',
}

const contentStyle = {
  flex: 1,
}

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  color: 'inherit',
  cursor: 'pointer',
  paddingLeft: '12px',
  opacity: 0.7,
}

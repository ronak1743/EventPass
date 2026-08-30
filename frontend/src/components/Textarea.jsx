import React from 'react'

export const Textarea = ({ label, id, name, value, onChange, placeholder, required = false, error, rows = 4 }) => {
  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        style={{
          ...textareaStyle,
          borderColor: error ? '#dc2626' : '#d1d5db',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#dc2626' : '#2563eb'
          e.target.style.boxShadow = error 
            ? '0 0 0 3px rgba(220, 38, 38, 0.15)' 
            : '0 0 0 3px rgba(37, 99, 235, 0.15)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#dc2626' : '#d1d5db'
          e.target.style.boxShadow = 'none'
        }}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%',
}

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
}

const textareaStyle = {
  fontFamily: 'inherit',
  padding: '10px 14px',
  fontSize: '14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
  transition: 'all 150ms ease',
  backgroundColor: '#ffffff',
  color: '#111827',
  resize: 'vertical',
}

const errorStyle = {
  fontSize: '12px',
  color: '#dc2626',
  marginTop: '2px',
}

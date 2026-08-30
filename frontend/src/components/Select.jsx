import React from 'react'

export const Select = ({ label, id, name, value, onChange, options = [], required = false, error, placeholder }) => {
  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          ...selectStyle,
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
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
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

const selectStyle = {
  fontFamily: 'inherit',
  padding: '10px 14px',
  fontSize: '14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
  transition: 'all 150ms ease',
  backgroundColor: '#ffffff',
  color: '#111827',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '16px',
  paddingRight: '36px',
}

const errorStyle = {
  fontSize: '12px',
  color: '#dc2626',
  marginTop: '2px',
}

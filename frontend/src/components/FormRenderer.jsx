import React from 'react'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'

export const FormRenderer = ({ fields = [], values = {}, onChange, errors = {} }) => {

  const handleFieldChange = (key, val) => {
    if (onChange) {
      onChange({ ...values, [key]: val })
    }
  }

  const renderFieldInput = (field) => {
    const value = values[field.fieldKey] ?? ''
    const error = errors[field.fieldKey]
    const required = field.required

    switch (field.fieldType) {
      case 'TEXT':
        return (
          <Input
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
          />
        )
      case 'TEXTAREA':
        return (
          <Textarea
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
          />
        )
      case 'NUMBER':
        return (
          <Input
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
          />
        )
      case 'EMAIL':
        return (
          <Input
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
          />
        )
      case 'MOBILE':
        return (
          <Input
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            type="tel"
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
            placeholder="e.g. +1234567890"
          />
        )
      case 'DATE':
        return (
          <Input
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
          />
        )
      case 'TIME':
        return (
          <Input
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            type="time"
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
          />
        )
      case 'DROPDOWN':
        return (
          <Select
            key={field.id}
            label={field.label}
            id={field.fieldKey}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            required={required}
            error={error}
            options={field.options || []}
            placeholder="Select an option"
          />
        )
      case 'RADIO':
        return (
          <div key={field.id} style={groupContainerStyle}>
            <label style={groupLabelStyle}>
              {field.label} {required && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            <div style={optionsRowStyle}>
              {(field.options || []).map((opt) => (
                <label key={opt} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name={field.fieldKey}
                    value={opt}
                    checked={value === opt}
                    onChange={() => handleFieldChange(field.fieldKey, opt)}
                    style={radioInputStyle}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {error && <span style={errorStyle}>{error}</span>}
          </div>
        )
      case 'CHECKBOX':
        const checkedList = Array.isArray(value) ? value : []
        const handleCheckboxChange = (opt, isChecked) => {
          let updated
          if (isChecked) {
            updated = [...checkedList, opt]
          } else {
            updated = checkedList.filter((item) => item !== opt)
          }
          handleFieldChange(field.fieldKey, updated)
        }
        return (
          <div key={field.id} style={groupContainerStyle}>
            <label style={groupLabelStyle}>
              {field.label} {required && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            <div style={optionsRowStyle}>
              {(field.options || []).map((opt) => (
                <label key={opt} style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={checkedList.includes(opt)}
                    onChange={(e) => handleCheckboxChange(opt, e.target.checked)}
                    style={checkboxInputStyle}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {error && <span style={errorStyle}>{error}</span>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={formContainerStyle}>
      {fields.map(renderFieldInput)}
    </div>
  )
}

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
}

const groupContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const groupLabelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
}

const optionsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
}

const radioLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  cursor: 'pointer',
}

const radioInputStyle = {
  cursor: 'pointer',
}

const checkboxLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  cursor: 'pointer',
}

const checkboxInputStyle = {
  cursor: 'pointer',
}

const errorStyle = {
  fontSize: '12px',
  color: '#dc2626',
}

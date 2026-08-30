import React from 'react'

export const RegistrationDetailModal = ({ isOpen, registration, fields = [], onClose }) => {
  if (!isOpen || !registration) return null

  // Build a lookup map: fieldKey -> label
  const fieldLabelMap = {}
  fields.forEach((f) => {
    fieldLabelMap[f.fieldKey] = f.label
  })

  const answers = registration.formData || {}

  return (
    <div style={overlayStyle} className="fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h3 style={headerTitleStyle}>Registration Details</h3>
          <button onClick={onClose} style={closeBtnStyle} title="Close">×</button>
        </div>

        <div style={bodyStyle}>
          {/* Basic Info */}
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>Basic Information</h4>
            <div style={gridStyle}>
              <div style={fieldStyle}>
                <span style={labelStyle}>Check-In Token</span>
                <span style={{ ...valueStyle, fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>
                  {registration.token}
                </span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Registered Name</span>
                <span style={valueStyle}>{registration.name || 'Anonymous'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Email Address</span>
                <span style={valueStyle}>{registration.email || 'None'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Mobile Phone</span>
                <span style={valueStyle}>{registration.mobile || 'None'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Allocated Slot</span>
                <span style={{ ...valueStyle, color: '#2563eb' }}>{registration.slotLabel || 'None'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Registration Status</span>
                <span style={{
                  ...valueStyle,
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: registration.status === 'CHECKED_IN' ? '#d1fae5' : '#eff6ff',
                  color: registration.status === 'CHECKED_IN' ? '#065f46' : '#1e40af',
                }}>
                  {registration.status}
                </span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Checked-in?</span>
                <span style={valueStyle}>{registration.checkedIn ? '✅ Yes' : '❌ No'}</span>
              </div>
              {registration.checkedInAt && (
                <div style={fieldStyle}>
                  <span style={labelStyle}>Checked-in At</span>
                  <span style={valueStyle}>{new Date(registration.checkedInAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Responses */}
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>Form Responses</h4>
            <div style={responsesListStyle}>
              {Object.keys(answers).length === 0 ? (
                <p style={emptyTextStyle}>No custom responses saved.</p>
              ) : (
                Object.entries(answers).map(([key, val]) => {
                  // Show human-readable label if available, fallback to key
                  const label = fieldLabelMap[key] || key
                  const displayVal = Array.isArray(val) ? val.join(', ') : val?.toString() || '—'
                  return (
                    <div key={key} style={responseItemStyle}>
                      <span style={responseKeyStyle}>{label}</span>
                      <span style={responseValStyle}>{displayVal}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '28px',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
  maxWidth: '600px',
  width: '100%',
  border: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '88vh',
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '14px',
  marginBottom: '20px',
}

const headerTitleStyle = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#111827',
}

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '26px',
  color: '#9ca3af',
  cursor: 'pointer',
  lineHeight: 1,
  padding: '0 4px',
  borderRadius: '4px',
  transition: 'color 0.15s',
}

const bodyStyle = {
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  paddingRight: '4px',
}

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const sectionTitleStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '8px',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px 28px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
}

const labelStyle = {
  fontSize: '11px',
  color: '#9ca3af',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
}

const valueStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#111827',
}

const responsesListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const responseItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 14px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  gap: '12px',
}

const responseKeyStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  flexShrink: 0,
}

const responseValStyle = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#6b7280',
  textAlign: 'right',
  wordBreak: 'break-word',
}

const emptyTextStyle = {
  fontSize: '13px',
  color: '#9ca3af',
  fontStyle: 'italic',
}

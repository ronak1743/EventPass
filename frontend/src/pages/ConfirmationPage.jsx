import React from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'

export const ConfirmationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { slug, token } = useParams()

  // Get parameters from navigation state
  const state = location.state || {}
  const eventTitle = state.eventTitle || 'Registration Complete'
  const slotLabel = state.slotLabel
  const slotDate = state.slotDate
  const slotTime = state.slotTime

  return (
    <div className="confirmation-card fade-in">
      <div style={iconContainerStyle}>
        <span style={iconStyle}>✓</span>
      </div>
      <h2 style={titleStyle}>Registration Confirmed!</h2>
      <p style={subtitleStyle}>You have successfully registered for:</p>
      <div style={eventTitleStyle}>{eventTitle}</div>

      <div style={tokenContainerStyle}>
        <div style={tokenLabelStyle}>Your Check-in Token</div>
        <div style={tokenValueStyle}>{token}</div>
        <p style={tokenHelpStyle}>Please screenshot or save this token. You will need it to check in at the event.</p>
      </div>

      {slotLabel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          <div style={slotContainerStyle}>
            <span style={slotLabelStyle}>Allocated Slot / Date:</span>
            <span style={slotValueStyle}>{slotLabel}</span>
          </div>
          {slotDate && (
            <div style={{ fontSize: '13px', color: '#4b5563' }}>
              <b>Date:</b> {slotDate}
            </div>
          )}
          {slotTime && (
            <div style={{ fontSize: '13px', color: '#4b5563' }}>
              <b>Time Slot:</b> {slotTime}
            </div>
          )}
        </div>
      )}

      <div style={btnRowStyle}>
        <Button onClick={() => navigate(`/event/${slug}`)} variant="secondary">
          Register Another Person
        </Button>
      </div>
    </div>
  )
}

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '40px 32px',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  maxWidth: '480px',
  width: '100%',
  border: '1px solid #e5e7eb',
  textAlign: 'center',
  alignSelf: 'center',
}

const iconContainerStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#ecfdf5',
  color: '#059669',
  fontSize: '28px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto',
}

const iconStyle = {
  lineHeight: 1,
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 800,
  color: '#111827',
  marginBottom: '8px',
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '8px',
}

const eventTitleStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '32px',
}

const tokenContainerStyle = {
  backgroundColor: '#f3f4f6',
  padding: '24px 16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  marginBottom: '24px',
}

const tokenLabelStyle = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '8px',
}

const tokenValueStyle = {
  fontSize: '32px',
  fontWeight: 800,
  color: '#111827',
  letterSpacing: '2px',
  fontFamily: 'monospace',
  marginBottom: '12px',
}

const tokenHelpStyle = {
  fontSize: '12px',
  color: '#4b5563',
  lineHeight: 1.5,
}

const slotContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '14px',
  color: '#374151',
  marginBottom: '32px',
}

const slotLabelStyle = {
  fontWeight: 500,
}

const slotValueStyle = {
  fontWeight: 700,
  color: '#2563eb',
}

const btnRowStyle = {
  display: 'flex',
  justifyContent: 'center',
}

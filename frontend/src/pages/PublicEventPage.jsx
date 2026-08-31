import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { FormRenderer } from '@/components/FormRenderer'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useToast } from '@/components/Toast'

export const PublicEventPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [eventData, setEventData] = useState(null)
  const [fields, setFields] = useState([])
  const [formData, setFormData] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [eventError, setEventError] = useState(null)
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [closedReason, setClosedReason] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await API.get(`/public/events/${slug}`)
        if (response.success && response.data) {
          setEventData(response.data.event)
          setRegistrationOpen(response.data.registrationOpen !== false)
          setClosedReason(response.data.closedReason || null)
          setFields(response.data.fields || [])

          // Initialize form state
          const initialData = {}
          ;(response.data.fields || []).forEach((f) => {
            initialData[f.fieldKey] = f.fieldType === 'CHECKBOX' ? [] : ''
          })
          setFormData(initialData)
        }
      } catch (err) {
        setEventError(err.message || 'Registration is currently unavailable.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [slug])

  const validateForm = () => {
    const errors = {}
    let isValid = true

    fields.forEach((f) => {
      const val = formData[f.fieldKey]

      if (f.required) {
        if (val === undefined || val === null || val.toString().trim() === '' || (Array.isArray(val) && val.length === 0)) {
          errors[f.fieldKey] = 'This field is required'
          isValid = false
        }
      }

      if (val && val.toString().trim() !== '') {
        const strVal = val.toString().trim()
        if (f.fieldType === 'EMAIL') {
          if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(strVal)) {
            errors[f.fieldKey] = 'Invalid email address'
            isValid = false
          }
        }
      }
    })

    setFieldErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please correct the validation errors first')
      return
    }

    setSubmitting(true)
    try {
      const response = await API.post(`/public/events/${slug}/register`, { formData })
      if (response.success && response.data) {
        toast.success('Registration successful!')
        navigate(`/event/${slug}/confirmation/${response.data.token}`, {
          state: {
            token: response.data.token,
            slotLabel: response.data.slotLabel,
            slotDate: response.data.slotDate,
            slotTime: response.data.slotTime,
            eventTitle: response.data.eventTitle,
          },
        })
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during submission')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={centeredContainerStyle}>
        <LoadingSpinner message="Loading event..." />
      </div>
    )
  }

  if (eventError) {
    return (
      <div style={errorCardStyle} className="fade-in">
        <div style={errorIconStyle}>⚠️</div>
        <h2 style={errorTitleStyle}>Event Unavailable</h2>
        <p style={errorMsgStyle}>{eventError}</p>
        <Button variant="secondary" onClick={() => window.location.reload()} style={{ marginTop: '16px' }}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="form-card fade-in">
      {/* Event header */}
      <div style={titleAreaStyle}>
        <h1 style={titleStyle}>{eventData?.title}</h1>
        {eventData?.location && <p style={metaStyle}>📍 {eventData.location}</p>}
        {eventData?.description && <p style={descStyle}>{eventData.description}</p>}
      </div>

      {/* Registration closed banner */}
      {!registrationOpen && (
        <div style={closedBannerStyle}>
          <span style={closedIconStyle}>🔒</span>
          <div>
            <p style={closedTitleStyle}>Registration Closed</p>
            <p style={closedReasonStyle}>{closedReason || 'This event is no longer accepting registrations.'}</p>
          </div>
        </div>
      )}

      {/* Registration form — only shown when open */}
      {registrationOpen && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <FormRenderer
            fields={fields}
            values={formData}
            onChange={setFormData}
            errors={fieldErrors}
          />

          <Button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '15px', fontWeight: 600 }}
          >
            {submitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </form>
      )}
    </div>
  )
}

const centeredContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  width: '100%',
}

const errorCardStyle = {
  backgroundColor: '#ffffff',
  padding: '48px 32px',
  borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
  border: '1px solid #fca5a5',
  alignSelf: 'center',
}

const errorIconStyle = {
  fontSize: '40px',
  marginBottom: '16px',
}

const errorTitleStyle = {
  fontSize: '22px',
  color: '#dc2626',
  fontWeight: 700,
  marginBottom: '8px',
}

const errorMsgStyle = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: 1.6,
}

const formCardStyle = {
  backgroundColor: '#ffffff',
  padding: '40px 36px',
  borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  maxWidth: '680px',
  width: '100%',
  border: '1px solid #e5e7eb',
  alignSelf: 'center',
}

const titleAreaStyle = {
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '24px',
  marginBottom: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const titleStyle = {
  fontSize: '28px',
  fontWeight: 800,
  color: '#111827',
  lineHeight: 1.2,
}

const metaStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#4b5563',
}

const descStyle = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: 1.7,
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

const closedBannerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
  backgroundColor: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: '10px',
  padding: '16px 20px',
  marginBottom: '8px',
}

const closedIconStyle = {
  fontSize: '22px',
  flexShrink: 0,
  marginTop: '2px',
}

const closedTitleStyle = {
  fontWeight: 700,
  fontSize: '14px',
  color: '#92400e',
  marginBottom: '4px',
}

const closedReasonStyle = {
  fontSize: '13px',
  color: '#b45309',
  lineHeight: 1.5,
}

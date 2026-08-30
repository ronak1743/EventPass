import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useToast } from '@/components/Toast'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/Button'
import { FormBuilder } from '@/features/form-builder/FormBuilder'
import { AllocationConfigComponent } from '@/features/events/AllocationConfig'
import { QRCodeDisplay } from '@/components/QRCodeDisplay'
import { RegistrationListPage } from '@/features/registrations/RegistrationListPage'
import { CheckInPage } from '@/features/registrations/CheckInPage'

export const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await API.get(`/admin/events/${id}`)
        if (response.success) {
          setEvent(response.data)
        }
      } catch (err) {
        toast.error('Failed to retrieve event details')
        navigate('/admin/events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, navigate, toast])

  if (loading) {
    return <LoadingSpinner message="Retrieving event details..." />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        const publicUrl = `${import.meta.env.VITE_FRONT_URL || window.location.origin}/event/${event?.slug}`
        return (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }} className="fade-in">
            <div style={{ ...tabCardStyle, flex: 2 }}>
              <h3 style={sectionTitleStyle}>Basic Information</h3>
              <div style={detailGridStyle}>
                <div style={detailFieldStyle}>
                  <span style={detailLabelStyle}>Location</span>
                  <span style={detailValueStyle}>{event?.location || 'Not specified'}</span>
                </div>
                <div style={detailFieldStyle}>
                  <span style={detailLabelStyle}>Registered / Capacity</span>
                  <span style={detailValueStyle}>
                    {event?.registeredCount} / {event?.totalCapacity}
                  </span>
                </div>
                <div style={detailFieldStyle}>
                  <span style={detailLabelStyle}>Registration Starts</span>
                  <span style={detailValueStyle}>
                    {event?.registrationStart ? new Date(event.registrationStart).toLocaleString() : 'Immediate'}
                  </span>
                </div>
                <div style={detailFieldStyle}>
                  <span style={detailLabelStyle}>Registration Ends</span>
                  <span style={detailValueStyle}>
                    {event?.registrationEnd ? new Date(event.registrationEnd).toLocaleString() : 'None'}
                  </span>
                </div>
                {event?.description && (
                  <div style={{ ...detailFieldStyle, gridColumn: 'span 2' }}>
                    <span style={detailLabelStyle}>Description</span>
                    <p style={descriptionTextStyle}>{event.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ ...tabCardStyle, flex: 1, alignItems: 'center' }}>
              <h3 style={{ ...sectionTitleStyle, width: '100%' }}>Registration Link & QR</h3>
              <QRCodeDisplay value={publicUrl} />
            </div>
          </div>
        )

      case 'form':
        return <FormBuilder eventId={id} />
      case 'allocation':
        return <AllocationConfigComponent eventId={id} initialAllocationEnabled={event?.allocationEnabled} />
      case 'registrations':
        return <RegistrationListPage eventId={id} />
      case 'checkin':
        return <CheckInPage eventId={id} />

      default:
        return null
    }
  }

  return (
    <div style={containerStyle}>
      {/* Event Header Card */}
      <div style={headerCardStyle}>
        <div style={headerLeftStyle}>
          <h2 style={titleStyle}>{event?.title}</h2>
          <div style={metaRowStyle}>
            <StatusBadge status={event?.status} />
            <span style={slugStyle}>Slug: {event?.slug}</span>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/events')}>
          Back to Events
        </Button>
      </div>

      {/* Tabs list */}
      <div style={tabsListStyle}>
        <button
          onClick={() => setActiveTab('details')}
          style={{ ...tabBtnStyle, ...(activeTab === 'details' ? activeTabBtnStyle : {}) }}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('form')}
          style={{ ...tabBtnStyle, ...(activeTab === 'form' ? activeTabBtnStyle : {}) }}
        >
          Form Builder
        </button>
        <button
          onClick={() => setActiveTab('allocation')}
          style={{ ...tabBtnStyle, ...(activeTab === 'allocation' ? activeTabBtnStyle : {}) }}
        >
          Allocation
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          style={{ ...tabBtnStyle, ...(activeTab === 'registrations' ? activeTabBtnStyle : {}) }}
        >
          Registrations
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          style={{ ...tabBtnStyle, ...(activeTab === 'checkin' ? activeTabBtnStyle : {}) }}
        >
          Check-In
        </button>
      </div>

      {/* Tab Area */}
      {renderTabContent()}
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

const headerCardStyle = {
  backgroundColor: '#ffffff',
  padding: '24px 32px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const headerLeftStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#111827',
}

const metaRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const slugStyle = {
  fontSize: '14px',
  color: '#6b7280',
}

const tabsListStyle = {
  display: 'flex',
  borderBottom: '1px solid #e5e7eb',
  gap: '8px',
}

const tabBtnStyle = {
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#6b7280',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 150ms ease',
}

const activeTabBtnStyle = {
  color: '#2563eb',
  borderBottomColor: '#2563eb',
  fontWeight: 600,
}

const tabCardStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

const sectionTitleStyle = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#111827',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '12px',
  marginBottom: '4px',
}

const detailGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
}

const detailFieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const detailLabelStyle = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const detailValueStyle = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#374151',
}

const descriptionTextStyle = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: 1.6,
}

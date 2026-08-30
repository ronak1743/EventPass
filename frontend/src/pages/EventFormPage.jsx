import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'

export const EventFormPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [registrationStart, setRegistrationStart] = useState('')
  const [registrationEnd, setRegistrationEnd] = useState('')
  const [totalCapacity, setTotalCapacity] = useState('')
  const [allocationEnabled, setAllocationEnabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !totalCapacity) {
      toast.error('Title and capacity are required')
      return
    }

    setSubmitting(true)
    try {
      const response = await API.post('/admin/events', {
        title,
        description,
        location,
        registrationStart: registrationStart ? new Date(registrationStart).toISOString() : null,
        registrationEnd: registrationEnd ? new Date(registrationEnd).toISOString() : null,
        totalCapacity: parseInt(totalCapacity, 10),
        allocationEnabled,
      })

      if (response.success) {
        toast.success('Event created successfully')
        navigate(`/admin/events/${response.data.id}`)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <h1 style={titleStyle}>Create New Event</h1>
        <p style={subtitleStyle}>Provide the details below to set up a new registration campaign</p>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={cardStyle}>
          <Input
            label="Event Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer Coding Bootcamp"
            required
          />

          <Textarea
            label="Description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the event, dates, schedules, etc..."
          />

          <Input
            label="Location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Online, Google Meet, or Physical address"
          />

          <div style={rowStyle}>
            <Input
              label="Registration Start Date & Time"
              id="registrationStart"
              type="datetime-local"
              value={registrationStart}
              onChange={(e) => setRegistrationStart(e.target.value)}
            />
            <Input
              label="Registration End Date & Time"
              id="registrationEnd"
              type="datetime-local"
              value={registrationEnd}
              onChange={(e) => setRegistrationEnd(e.target.value)}
            />
          </div>

          <div style={rowStyle}>
            <Input
              label="Maximum Seat Capacity"
              id="totalCapacity"
              type="number"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(e.target.value)}
              placeholder="e.g. 150"
              required
            />
            <div style={checkboxContainerStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={allocationEnabled}
                  onChange={(e) => setAllocationEnabled(e.target.checked)}
                  style={checkboxStyle}
                />
                Enable Seat/Date Allocation
              </label>
              <p style={helpTextStyle}>sequential assignment (e.g. 50 per day/slot)</p>
            </div>
          </div>
        </div>

        <div style={actionWrapperStyle}>
          <Button variant="secondary" onClick={() => navigate('/admin/events')}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  )
}

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const titleStyle = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#111827',
  letterSpacing: '-0.5px',
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#6b7280',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

const rowStyle = {
  display: 'flex',
  gap: '20px',
}

const checkboxContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: '4px',
  width: '100%',
}

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
  cursor: 'pointer',
}

const checkboxStyle = {
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
}

const helpTextStyle = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '4px',
  paddingLeft: '24px',
}

const actionWrapperStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
}

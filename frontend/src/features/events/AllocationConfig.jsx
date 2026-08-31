import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'

export const AllocationConfigComponent = ({ eventId, initialAllocationEnabled }) => {
  const toast = useToast()
  
  const [allocationEnabled, setAllocationEnabled] = useState(initialAllocationEnabled)
  const [allocationType, setAllocationType] = useState('DATE')
  const [seatsPerUnit, setSeatsPerUnit] = useState('50')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchAllocation = async () => {
      if (!initialAllocationEnabled) {
        setLoading(false)
        return
      }
      try {
        const response = await API.get(`/admin/events/${eventId}/allocation`)
        if (response.success && response.data) {
          setAllocationType(response.data.allocationType)
          setSeatsPerUnit(response.data.seatsPerUnit?.toString() || '50')
          setSlots(response.data.slots || [])
        }
      } catch (err) {
        // Safe to ignore if not created yet
      } finally {
        setLoading(false)
      }
    }
    fetchAllocation()
  }, [eventId, initialAllocationEnabled])

  const handleAddSlot = () => {
    setSlots((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9), // temp client id
        label: `Slot ${prev.length + 1}`,
        slotDate: '',
        slotTime: '',
        capacity: parseInt(seatsPerUnit, 10) || 50,
        displayOrder: prev.length,
      },
    ])
  }

  const handleRemoveSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSlotChange = (index, field, value) => {
    setSlots((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (allocationEnabled && slots.length === 0) {
      toast.error('Please configure at least one allocation slot')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        allocationType,
        seatsPerUnit: parseInt(seatsPerUnit, 10),
        slots: slots.map((s, idx) => ({
          label: s.label,
          slotDate: s.slotDate || null,
          slotTime: s.slotTime || null,
          capacity: parseInt(s.capacity, 10) || 50,
          displayOrder: idx,
        })),
      }

      const response = await API.put(`/admin/events/${eventId}/allocation`, payload)
      if (response.success) {
        toast.success('Allocation config saved successfully')
        setSlots(response.data.slots || [])
        setAllocationEnabled(true)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save config')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading allocation configurations...</div>

  return (
    <form onSubmit={handleSave} style={formStyle} className="fade-in">
      <h3 style={sectionTitleStyle}>Seat / Date Allocation</h3>
      <p style={subtitleStyle}>Configure how users are assigned to specific slots or dates sequentially</p>

      <div style={toggleContainerStyle}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={allocationEnabled}
            onChange={(e) => setAllocationEnabled(e.target.checked)}
            style={checkboxStyle}
          />
          Enable slot/date allocation for this event
        </label>
      </div>

      {allocationEnabled && (
        <div style={configBoxStyle} className="fade-in">
          <div className="form-row">
            <Select
              label="Allocation Type"
              id="allocationType"
              value={allocationType}
              onChange={(e) => setAllocationType(e.target.value)}
              options={[
                { value: 'DATE', label: 'Date Allocation' },
                { value: 'SLOT', label: 'Time Slot Allocation' },
              ]}
            />
            <Input
              label="Default Seats Per Unit"
              id="seatsPerUnit"
              type="number"
              value={seatsPerUnit}
              onChange={(e) => setSeatsPerUnit(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>

          <div style={slotsSectionStyle}>
            <div style={slotsHeaderStyle}>
              <span style={slotsLabelStyle}>Allocation Slots</span>
              <Button type="button" variant="secondary" onClick={handleAddSlot}>
                + Add Slot
              </Button>
            </div>

            {slots.length === 0 ? (
              <div style={emptySlotsStyle}>No slots configured. Click "Add Slot" above.</div>
            ) : (
              <div style={slotsListStyle}>
                {slots.map((slot, index) => (
                  <div key={slot.id || index} className="slot-item-responsive">
                    <Input
                      label="Slot Label"
                      id={`slot-label-${index}`}
                      value={slot.label}
                      onChange={(e) => handleSlotChange(index, 'label', e.target.value)}
                      required
                    />
                    {allocationType === 'DATE' ? (
                      <Input
                        label="Date"
                        id={`slot-date-${index}`}
                        type="date"
                        value={slot.slotDate || ''}
                        onChange={(e) => handleSlotChange(index, 'slotDate', e.target.value)}
                        required
                      />
                    ) : (
                      <Input
                        label="Time Range"
                        id={`slot-time-${index}`}
                        value={slot.slotTime || ''}
                        onChange={(e) => handleSlotChange(index, 'slotTime', e.target.value)}
                        placeholder="e.g. 9 AM - 12 PM"
                        required
                      />
                    )}
                    <Input
                      label="Capacity"
                      id={`slot-cap-${index}`}
                      type="number"
                      value={slot.capacity || ''}
                      onChange={(e) => handleSlotChange(index, 'capacity', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(index)}
                      style={removeBtnStyle}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={actionStyle}>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving settings...' : 'Save Allocation Settings'}
        </Button>
      </div>
    </form>
  )
}

const formStyle = {
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
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '-8px',
}

const toggleContainerStyle = {
  padding: '8px 0',
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
  cursor: 'pointer',
}

const configBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
}

const rowStyle = {
  display: 'flex',
  gap: '20px',
}

const slotsSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const slotsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const slotsLabelStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
}

const emptySlotsStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center',
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px dashed #d1d5db',
}

const slotsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const slotItemStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
}

const removeBtnStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  color: '#dc2626',
  cursor: 'pointer',
  paddingBottom: '4px',
}

const actionStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
}

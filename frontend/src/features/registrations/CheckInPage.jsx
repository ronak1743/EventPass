import React, { useState } from 'react'
import API from '@/api/axios'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'

export const CheckInPage = ({ eventId }) => {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    try {
      const response = await API.get(`/admin/events/${eventId}/checkin/search`, {
        params: { q: query.trim() },
      })
      if (response.success) {
        setCandidates(response.data || [])
      }
    } catch (err) {
      toast.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  const handleCheckIn = async (registrationId) => {
    try {
      const response = await API.post(`/admin/events/${eventId}/checkin`, {
        registrationId,
      })
      if (response.success) {
        toast.success(response.message || 'Check-in completed successfully!')
        
        // Update local candidates state list to show success
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === registrationId
              ? { ...c, checkedIn: true, status: 'CHECKED_IN', checkedInAt: new Date().toISOString() }
              : c
          )
        )
      }
    } catch (err) {
      toast.error(err.message || 'Check-in failed')
    }
  }

  return (
    <div style={containerStyle} className="fade-in">
      <h3 style={sectionTitleStyle}>Attendee Check-In</h3>
      <p style={subtitleStyle}>Search and check in attendees by name, token, email, or mobile number</p>

      {/* Search Row */}
      <form onSubmit={handleSearch} className="checkin-search-row">
        <Input
          id="checkinQuery"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type name, token, email, or mobile..."
        />
        <Button type="submit" disabled={searching} style={{ padding: '10px 24px' }}>
          {searching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* Candidates List */}
      <div style={resultsContainerStyle}>
        {candidates.length === 0 ? (
          <div style={emptyResultsStyle}>No candidates found. Enter a search query above.</div>
        ) : (
          <div style={candidatesListStyle}>
            {candidates.map((c) => (
              <div key={c.id} className="checkin-candidate-card">
                <div style={candidateInfoStyle}>
                  <div style={candidateNameStyle}>{c.name || 'Anonymous'}</div>
                  <div style={candidateMetaStyle}>
                    <span>Token: <b>{c.token}</b></span>
                    {c.slotLabel && <span>Slot: <b>{c.slotLabel}</b></span>}
                    {c.email && <span>Email: {c.email}</span>}
                    {c.mobile && <span>Mobile: {c.mobile}</span>}
                  </div>
                </div>

                <div style={actionAreaStyle}>
                  {c.checkedIn ? (
                    <div style={checkedInBadgeStyle}>
                      Checked In ✓
                      {c.checkedInAt && (
                        <span style={timeStyle}>{new Date(c.checkedInAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                  ) : (
                    <Button onClick={() => handleCheckIn(c.id)}>
                      Check In
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const containerStyle = {
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

const searchFormStyle = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-end',
  maxWidth: '560px',
}

const resultsContainerStyle = {
  marginTop: '12px',
}

const emptyResultsStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center',
  padding: '48px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px dashed #d1d5db',
}

const candidatesListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const candidateCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}

const candidateInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const candidateNameStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
}

const candidateMetaStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  fontSize: '13px',
  color: '#6b7280',
}

const actionAreaStyle = {
  display: 'flex',
  alignItems: 'center',
}

const checkedInBadgeStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  color: '#059669',
  fontWeight: 600,
  fontSize: '14px',
}

const timeStyle = {
  fontSize: '11px',
  color: '#6b7280',
  fontWeight: 'normal',
  marginTop: '2px',
}

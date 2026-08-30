import React, { useEffect, useState } from 'react'
import API from '@/api/axios'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useToast } from '@/components/Toast'

export const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/admin/events/stats')
        if (response.success) {
          setStats(response.data)
        }
      } catch (err) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [toast])

  if (loading) {
    return <LoadingSpinner message="Gathering metrics..." />
  }

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        <p style={subtitleStyle}>Real-time analytics across all your events and campaigns</p>
      </div>

      {/* Grid of stats */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Events</div>
          <div style={cardValueStyle}>{stats?.totalEvents ?? 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Active Campaigns</div>
          <div style={{ ...cardValueStyle, color: '#059669' }}>{stats?.activeEvents ?? 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Registrations</div>
          <div style={cardValueStyle}>{stats?.totalRegistrations ?? 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Capacity Utilization</div>
          <div style={{ ...cardValueStyle, color: '#2563eb' }}>
            {stats?.capacityUtilization ? stats.capacityUtilization.toFixed(1) : '0.0'}%
          </div>
        </div>
      </div>
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '28px 24px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const cardLabelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const cardValueStyle = {
  fontSize: '36px',
  fontWeight: 700,
  color: '#111827',
}

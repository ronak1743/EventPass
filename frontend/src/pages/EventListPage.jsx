import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export const EventListPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')

  // Dialog states
  const [archiveId, setArchiveId] = useState(null)

  const fetchEvents = async (currPage = page) => {
    setLoading(true)
    try {
      const response = await API.get('/admin/events', {
        params: {
          page: currPage,
          size: 10,
          sortBy: 'createdAt',
          direction: 'desc',
        },
      })
      if (response.success) {
        setEvents(response.data.content)
        setTotalElements(response.data.totalElements)
        setTotalPages(response.data.totalPages)
      }
    } catch (err) {
      toast.error('Failed to retrieve events list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(page)
  }, [page])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleStatusChange = async (id, status, successMessage) => {
    try {
      const response = await API.patch(`/admin/events/${id}/status`, null, {
        params: { status },
      })
      if (response.success) {
        toast.success(successMessage || `Event status updated to ${status}`)
        setArchiveId(null)
        fetchEvents()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'capacity',
      label: 'Capacity / Registrations',
      render: (row) => (
        <span>
          {row.registeredCount} / {row.totalCapacity}
        </span>
      ),
    },
    {
      key: 'slug',
      label: 'Registration URL',
      render: (row) => {
        const url = `${import.meta.env.VITE_FRONT_URL || window.location.origin}/event/${row.slug}`
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" style={urlStyle}>
            View Page
          </a>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={actionsContainerStyle}>
          <Button variant="secondary" onClick={() => navigate(`/admin/events/${row.id}`)}>
            Manage
          </Button>
          {row.status === 'DRAFT' && (
            <Button variant="success" onClick={() => handleStatusChange(row.id, 'PUBLISHED', 'Event published successfully')}>
              Publish
            </Button>
          )}
          {row.status === 'PUBLISHED' && (
            <Button variant="danger" onClick={() => handleStatusChange(row.id, 'CLOSED', 'Registration closed successfully')}>
              Close Form
            </Button>
          )}
          {row.status === 'CLOSED' && (
            <Button variant="success" onClick={() => handleStatusChange(row.id, 'PUBLISHED', 'Registration reopened successfully')}>
              Reopen Form
            </Button>
          )}
          {row.status !== 'ARCHIVED' && (
            <Button variant="secondary" onClick={() => setArchiveId(row.id)}>
              Complete Event
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Events</h1>
          <p style={subtitleStyle}>Create and manage event registration pages</p>
        </div>
        <Button onClick={() => navigate('/admin/events/new')}>
          Create Event
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={archiveId !== null}
        title="Complete Event?"
        message="Marking this event as complete will archive it. Registrations will be closed. Are you sure?"
        onConfirm={() => handleStatusChange(archiveId, 'ARCHIVED', 'Event marked as complete')}
        onCancel={() => setArchiveId(null)}
      />
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
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

const actionsContainerStyle = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
}

const urlStyle = {
  fontSize: '14px',
  fontWeight: 500,
}

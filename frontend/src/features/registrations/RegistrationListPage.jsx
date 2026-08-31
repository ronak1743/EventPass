import React, { useEffect, useState } from 'react'
import API from '@/api/axios'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { RegistrationDetailModal } from '@/components/RegistrationDetailModal'
import { Select } from '@/components/Select'
import { ExportButton } from '@/components/ExportButton'

export const RegistrationListPage = ({ eventId }) => {
  const toast = useToast()
  
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [slotFilter, setSlotFilter] = useState('')
  const [slotsList, setSlotsList] = useState([])

  // Modal / dialog states
  const [selectedReg, setSelectedReg] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [formFields, setFormFields] = useState([])

  const fetchSlots = async () => {
    try {
      const response = await API.get(`/admin/events/${eventId}/allocation`)
      if (response.success && response.data) {
        setSlotsList(response.data.slots || [])
      }
    } catch (err) {
      // Safe to ignore if event has no allocation
    }
  }

  const fetchRegistrations = async (currPage = page, searchVal = search, statusVal = statusFilter, slotVal = slotFilter) => {
    setLoading(true)
    try {
      const response = await API.get(`/admin/events/${eventId}/registrations`, {
        params: {
          page: currPage,
          size: 10,
          search: searchVal || null,
          status: statusVal || null,
          slotId: slotVal || null,
        },
      })
      if (response.success) {
        setRegistrations(response.data.content)
        setTotalElements(response.data.totalElements)
        setTotalPages(response.data.totalPages)
      }
    } catch (err) {
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
    // Fetch form fields so the modal can show labels instead of field keys
    API.get(`/admin/events/${eventId}/fields`)
      .then((res) => { if (res.success) setFormFields(res.data || []) })
      .catch(() => {})
  }, [eventId])

  useEffect(() => {
    fetchRegistrations(page, search, statusFilter, slotFilter)
  }, [page, search, statusFilter, slotFilter])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleSearch = (val) => {
    setSearch(val)
    setPage(0)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const response = await API.delete(`/admin/events/${eventId}/registrations/${deleteId}`)
      if (response.success) {
        toast.success('Registration deleted successfully')
        setDeleteId(null)
        fetchRegistrations()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete registration')
    }
  }

  const columns = [
    { key: 'name', label: 'Attendee Name', sortable: true },
    { key: 'token', label: 'Token', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'slotLabel', label: 'Slot / Date', render: (row) => row.slotLabel || '—' },
    {
      key: 'checkedIn',
      label: 'Checked In',
      render: (row) => (
        <span style={row.checkedIn ? checkInYesStyle : checkInNoStyle}>
          {row.checkedIn ? 'Yes ✓' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Registered At',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={actionsStyle}>
          <Button variant="secondary" onClick={() => setSelectedReg(row)} style={{ padding: '6px 12px', fontSize: '13px' }}>
            View responses
          </Button>
          <Button variant="danger" onClick={() => setDeleteId(row.id)} style={{ padding: '6px 12px', fontSize: '13px' }}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={containerStyle} className="fade-in">
      {/* Filtering Row */}
      <div style={filterHeaderContainerStyle}>
        <div style={filtersRowStyle}>
          <div style={{ flex: '1 1 140px', minWidth: '130px' }}>
            <Select
              label="Filter by Status"
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
              options={[
                { value: 'REGISTERED', label: 'REGISTERED' },
                { value: 'CHECKED_IN', label: 'CHECKED_IN' },
                { value: 'CANCELLED', label: 'CANCELLED' },
              ]}
              placeholder="All Statuses"
            />
          </div>
          {slotsList.length > 0 && (
            <div style={{ flex: '1 1 140px', minWidth: '130px' }}>
              <Select
                label="Filter by Slot"
                id="slotFilter"
                value={slotFilter}
                onChange={(e) => {
                  setSlotFilter(e.target.value)
                  setPage(0)
                }}
                options={slotsList.map((s) => ({ value: s.id, label: s.label }))}
                placeholder="All Slots"
              />
            </div>
          )}
        </div>
        <ExportButton eventId={eventId} />
      </div>

      <DataTable
        columns={columns}
        data={registrations}
        loading={loading}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search by name, email, token..."
      />

      <RegistrationDetailModal
        isOpen={selectedReg !== null}
        registration={selectedReg}
        fields={formFields}
        onClose={() => setSelectedReg(null)}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Registration?"
        message="Are you sure you want to delete this registration? The associated seats/slots will be released back to inventory."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const filterHeaderContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '8px',
}

const filtersRowStyle = {
  display: 'flex',
  gap: '16px',
  flex: '1 1 300px',
  flexWrap: 'wrap',
  minWidth: '280px',
}

const actionsStyle = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
}

const checkInYesStyle = {
  color: '#059669',
  fontWeight: 600,
}

const checkInNoStyle = {
  color: '#6b7280',
}

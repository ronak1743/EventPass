import React, { useState } from 'react'
import { Button } from './Button'
import { useToast } from './Toast'

export const ExportButton = ({ eventId }) => {
  const toast = useToast()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleDownload = async (format) => {
    setExporting(true)
    setDropdownOpen(false)
    try {
      // Use native fetch to handle binary blob downloads
      // VITE_BACKEND_URL = http://localhost:8080/api so strip the /api suffix for base
      const backendBase = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api')
        .replace(/\/api$/, '')
      const token = localStorage.getItem('regweb_token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(
        `${backendBase}/api/admin/events/${eventId}/export/${format}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `registrations.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success(`Exported as ${format.toUpperCase()} successfully`)
    } catch (err) {
      console.error('Export error:', err)
      toast.error('Failed to export registrations')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={containerStyle}>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setDropdownOpen((prev) => !prev)}
        disabled={exporting}
      >
        {exporting ? 'Exporting...' : 'Export Registrations ▾'}
      </Button>

      {dropdownOpen && (
        <div style={dropdownStyle} className="fade-in">
          <button
            type="button"
            onClick={() => handleDownload('csv')}
            style={dropdownItemStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            📄 Export as CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            style={dropdownItemStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            📕 Export as PDF
          </button>
        </div>
      )}
    </div>
  )
}

const containerStyle = {
  position: 'relative',
  display: 'inline-block',
}

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '8px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  width: '180px',
  overflow: 'hidden',
}

const dropdownItemStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  padding: '12px 16px',
  fontSize: '13px',
  color: '#374151',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  transition: 'background-color 0.15s',
  display: 'block',
}

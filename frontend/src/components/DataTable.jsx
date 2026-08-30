import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { EmptyState } from './EmptyState'

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  totalElements = 0,
  totalPages = 1,
  currentPage = 0,
  pageSize = 10,
  onPageChange,
  onSort,
  onSearch,
  searchPlaceholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [sortField, setSortField] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('asc')

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    if (onSearch) {
      onSearch(val)
    }
  }

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(newOrder)
    if (onSort) {
      onSort(field, newOrder)
    }
  }

  return (
    <div style={containerStyle}>
      {/* Top Search bar */}
      {onSearch && (
        <div style={searchContainerStyle}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            style={searchInputStyle}
          />
        </div>
      )}

      {/* Table */}
      <div style={tableWrapperStyle}>
        {loading ? (
          <div style={loadingWrapperStyle}>
            <LoadingSpinner message="Loading records..." />
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={trHeaderStyle}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    style={{
                      ...thStyle,
                      cursor: col.sortable ? 'pointer' : 'default',
                      textAlign: col.align || 'left',
                    }}
                  >
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      <span style={sortIconStyle}>
                        {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id || idx} style={idx % 2 === 0 ? trEvenStyle : trOddStyle}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ ...tdStyle, textAlign: col.align || 'left' }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div style={paginationContainerStyle}>
          <div style={pageInfoStyle}>
            Showing page {currentPage + 1} of {totalPages} ({totalElements} total entries)
          </div>
          <div style={btnGroupStyle}>
            <button
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              style={currentPage === 0 ? disabledPageBtnStyle : pageBtnStyle}
            >
              Previous
            </button>
            <button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              style={currentPage + 1 >= totalPages ? disabledPageBtnStyle : pageBtnStyle}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const containerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

const searchContainerStyle = {
  padding: '16px 24px',
  borderBottom: '1px solid #e5e7eb',
}

const searchInputStyle = {
  width: '100%',
  maxWidth: '320px',
  padding: '8px 12px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  outline: 'none',
  fontFamily: 'inherit',
}

const tableWrapperStyle = {
  overflowX: 'auto',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
}

const loadingWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  padding: '48px',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
}

const trHeaderStyle = {
  backgroundColor: '#f9fafb',
  borderBottom: '1px solid #e5e7eb',
}

const thStyle = {
  padding: '12px 24px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#4b5563',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const tdStyle = {
  padding: '16px 24px',
  fontSize: '14px',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb',
}

const trEvenStyle = {
  backgroundColor: '#ffffff',
}

const trOddStyle = {
  backgroundColor: '#f9fafb',
}

const sortIconStyle = {
  fontSize: '10px',
  color: '#6b7280',
}

const paginationContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
}

const pageInfoStyle = {
  fontSize: '14px',
  color: '#4b5563',
}

const btnGroupStyle = {
  display: 'flex',
  gap: '8px',
}

const pageBtnStyle = {
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 500,
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  color: '#374151',
  cursor: 'pointer',
  transition: 'all 150ms ease',
}

const disabledPageBtnStyle = {
  ...pageBtnStyle,
  color: '#9ca3af',
  cursor: 'not-allowed',
  backgroundColor: '#f3f4f6',
  borderColor: '#e5e7eb',
}

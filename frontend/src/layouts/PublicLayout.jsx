import React from 'react'
import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <div style={layoutStyle}>
      <header style={headerStyle}>
        <div style={logoStyle}>EventPass</div>
      </header>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  )
}

const layoutStyle = {
  minHeight: '100vh',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  flexDirection: 'column',
}

const headerStyle = {
  height: '64px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  justifyContent: 'center',
}

const logoStyle = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#2563eb',
  letterSpacing: '-0.5px',
}

const mainStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 16px',
}

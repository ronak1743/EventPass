import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/Button'

export const AdminLayout = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={logoContainerStyle}>
          <Link to="/admin" style={logoStyle}>EventPass Admin</Link>
        </div>
        <nav style={navStyle}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeLinkStyle : {}),
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/events"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeLinkStyle : {}),
            })}
          >
            Events
          </NavLink>
        </nav>
        <div style={logoutContainerStyle}>
          <Button variant="danger" onClick={handleLogout} style={{ width: '100%' }}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={mainAreaStyle}>
        {/* Topbar */}
        <header style={headerStyle}>
          <div style={headerTitleStyle}>Welcome back, {admin?.username || 'Admin'}</div>
          <div style={adminInfoStyle}>
            <span style={avatarStyle}>
              {admin?.username ? admin.username.substring(0, 2).toUpperCase() : 'AD'}
            </span>
            <span style={emailStyle}>{admin?.email}</span>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={contentStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
}

const sidebarStyle = {
  width: '260px',
  backgroundColor: '#1f2937',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 16px',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
}

const logoContainerStyle = {
  marginBottom: '40px',
  paddingLeft: '8px',
}

const logoStyle = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#ffffff',
  textDecoration: 'none',
}

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
}

const navLinkStyle = {
  display: 'block',
  padding: '12px 16px',
  borderRadius: '8px',
  color: '#9ca3af',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'all 150ms ease',
}

const activeLinkStyle = {
  backgroundColor: '#374151',
  color: '#ffffff',
}

const logoutContainerStyle = {
  marginTop: 'auto',
}

const mainAreaStyle = {
  marginLeft: '260px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

const headerStyle = {
  height: '70px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
}

const headerTitleStyle = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#111827',
}

const adminInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const avatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#eff6ff',
  color: '#2563eb',
  fontWeight: 600,
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const emailStyle = {
  fontSize: '14px',
  color: '#4b5563',
}

const contentStyle = {
  padding: '32px',
  flex: 1,
}

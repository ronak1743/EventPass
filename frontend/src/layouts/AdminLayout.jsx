import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/Button'

export const AdminLayout = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Track responsiveness and sidebar state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false) // always close mobile drawer on desktop resize
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <div style={layoutStyle}>
      {/* Mobile Backdrop overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          style={backdropStyle} 
          onClick={() => setIsSidebarOpen(false)}
          className="fade-in"
        />
      )}

      {/* Sidebar (Responsive drawer on mobile) */}
      <aside style={{
        ...sidebarStyle,
        left: isMobile ? (isSidebarOpen ? '0' : '-280px') : '0',
        width: isMobile ? '280px' : '260px',
        boxShadow: isMobile && isSidebarOpen ? '4px 0 25px rgba(0,0,0,0.15)' : 'none',
      }}>
        <div style={logoContainerStyle}>
          <Link to="/admin" style={logoStyle}>EventPass Admin</Link>
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              style={closeSidebarBtnStyle}
            >
              ✕
            </button>
          )}
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
      <div style={{
        ...mainAreaStyle,
        marginLeft: isMobile ? '0' : '260px',
      }}>
        {/* Topbar */}
        <header style={{
          ...headerStyle,
          padding: isMobile ? '0 16px' : '0 32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen((prev) => !prev)} 
                style={hamburgerBtnStyle}
                aria-label="Toggle Sidebar"
              >
                ☰
              </button>
            )}
            <div style={{
              ...headerTitleStyle,
              fontSize: isMobile ? '16px' : '18px',
            }}>
              Welcome back, {admin?.username || 'Admin'}
            </div>
          </div>
          <div style={adminInfoStyle}>
            <span style={avatarStyle}>
              {admin?.username ? admin.username.substring(0, 2).toUpperCase() : 'AD'}
            </span>
            {!isMobile && <span style={emailStyle}>{admin?.email}</span>}
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{
          ...contentStyle,
          padding: isMobile ? '16px' : '32px',
        }}>
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
  backgroundColor: '#1f2937',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 16px',
  position: 'fixed',
  top: 0,
  bottom: 0,
  zIndex: 1000,
  transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
}

const logoContainerStyle = {
  marginBottom: '40px',
  paddingLeft: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const logoStyle = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#ffffff',
  textDecoration: 'none',
}

const closeSidebarBtnStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#9ca3af',
  fontSize: '20px',
  cursor: 'pointer',
  padding: '4px',
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
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
}

const headerStyle = {
  height: '70px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const hamburgerBtnStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  color: '#374151',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const headerTitleStyle = {
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
  flex: 1,
}

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 999,
  backdropFilter: 'blur(3px)',
}

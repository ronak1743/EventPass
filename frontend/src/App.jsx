import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import { ToastProvider } from '@/components/Toast'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { LoginPage } from '@/features/auth/LoginPage'

// Lazy pages loading via direct import for simplicity
import { DashboardPage } from '@/pages/DashboardPage'
import { EventListPage } from '@/pages/EventListPage'
import { EventFormPage } from '@/pages/EventFormPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { PublicEventPage } from '@/pages/PublicEventPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Portal (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="events" element={<EventListPage />} />
              <Route path="events/new" element={<EventFormPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
            </Route>

            {/* Public Registration Views */}
            <Route path="/event" element={<PublicLayout />}>
              <Route path=":slug" element={<PublicEventPage />} />
              <Route path=":slug/confirmation/:token" element={<ConfirmationPage />} />
            </Route>

            {/* Fallbacks */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<div style={notFoundStyle}><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

const notFoundStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f3f4f6',
}

export default App

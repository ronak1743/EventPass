import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

export const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth()

  if (loading) {
    return (
      <div style={loadingContainer}>
        <LoadingSpinner message="Checking authentication..." />
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return children
}

const loadingContainer = {
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9fafb',
}

import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '@/api/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const response = await API.get('/auth/me')
      if (response.success) {
        setAdmin(response.data)
      } else {
        logout()
      }
    } catch (err) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('regweb_token')
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const response = await API.post('/auth/login', { username, password })
      if (response.success) {
        localStorage.setItem('regweb_token', response.data.token)
        setAdmin({
          username: response.data.username,
          email: response.data.email,
        })
        return { success: true }
      }
      return { success: false, message: response.message || 'Login failed' }
    } catch (err) {
      return { success: false, message: err.message || 'Invalid username or password' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('regweb_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

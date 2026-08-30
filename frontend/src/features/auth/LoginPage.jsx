import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Please enter both username and password')
      return
    }
    
    setSubmitting(true)
    const result = await login(username, password)
    setSubmitting(false)

    if (result.success) {
      toast.success('Successfully logged in')
      navigate('/admin')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="fade-in">
        <h2 style={titleStyle}>Admin Login</h2>
        <p style={subtitleStyle}>Access your event registration system</p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <Input
            label="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          
          <Button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}

const pageStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f3f4f6',
  padding: '16px',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '40px 32px',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  maxWidth: '400px',
  width: '100%',
  border: '1px solid #e5e7eb',
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#111827',
  textAlign: 'center',
  marginBottom: '8px',
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center',
  marginBottom: '32px',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

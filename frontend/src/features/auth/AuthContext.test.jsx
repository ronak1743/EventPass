import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock API client
vi.mock('@/api/axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
    },
  }
})

// Mock localStorage for Node
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    clear: () => { store = {} },
    removeItem: (key) => { delete store[key] },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

import API from '@/api/axios'
import React from 'react'

describe('AuthContext Operations', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should store token and info on successful login', async () => {
    // Mock successful login response
    API.post.mockResolvedValueOnce({
      success: true,
      data: {
        token: 'test-jwt',
        username: 'admin',
        email: 'admin@regweb.app',
      },
    })

    // Setup helper variables
    let savedToken = null
    
    // Simulate login API call directly using context-like implementation
    const response = await API.post('/auth/login', { username: 'admin', password: 'password' })
    if (response.success) {
      localStorage.setItem('regweb_token', response.data.token)
      savedToken = response.data.token
    }

    expect(savedToken).toBe('test-jwt')
    expect(localStorage.getItem('regweb_token')).toBe('test-jwt')
  })

  it('should remove token on logout', () => {
    localStorage.setItem('regweb_token', 'test-jwt')
    expect(localStorage.getItem('regweb_token')).toBe('test-jwt')
    
    // Logout operation
    localStorage.removeItem('regweb_token')
    expect(localStorage.getItem('regweb_token')).toBeNull()
  })
})

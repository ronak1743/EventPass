import { describe, it, expect, beforeEach } from 'vitest'

// Mock localStorage for Node environment
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

// Mock window location
global.window = {
  location: {
    pathname: '',
  },
}

import API from './axios'

describe('Axios Client Base Configuration', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.pathname = ''
  })

  it('should use base URL from env or fallback', () => {
    expect(API.defaults.baseURL).toBeDefined()
  })

  it('should set Authorization header if token exists in localStorage', async () => {
    localStorage.setItem('regweb_token', 'mocked-jwt-token')
    
    // Trigger request interceptor manually
    const config = { headers: {} }
    const interceptor = API.interceptors.request.handlers[0]
    const resolvedConfig = interceptor.fulfilled(config)
    
    expect(resolvedConfig.headers.Authorization).toBe('Bearer mocked-jwt-token')
  })

  it('should not set Authorization header if token does not exist', () => {
    const config = { headers: {} }
    const interceptor = API.interceptors.request.handlers[0]
    const resolvedConfig = interceptor.fulfilled(config)
    
    expect(resolvedConfig.headers.Authorization).toBeUndefined()
  })
})

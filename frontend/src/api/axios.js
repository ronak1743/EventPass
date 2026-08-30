import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor to append Authorization JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('regweb_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor for global error handling
API.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // JWT token expired or unauthorized -> logout
      if (error.response.status === 401 && window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('regweb_token')
        window.location.href = '/login'
      }
      return Promise.reject(error.response.data || { message: 'An error occurred' })
    }
    return Promise.reject({ message: 'Network error or server offline' })
  }
)

export default API

import axios from 'axios'

const DEFAULT_API_BASE = 'http://localhost:8989/api'
const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim()
const API_BASE_URL = (configuredBase && configuredBase.length > 0 ? configuredBase : DEFAULT_API_BASE).replace(/\/$/, '')

// Create axios instance
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - attach JWT token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ghostwrite_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), token expired - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('ghostwrite_token')
      localStorage.removeItem('ghostwrite_user')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

export default axiosClient

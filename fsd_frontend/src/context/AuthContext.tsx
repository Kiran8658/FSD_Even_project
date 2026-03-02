import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../services/api'
import type { User } from '../types/dashboard'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signUp: (name: string, username: string, email: string, password: string) => Promise<void>
  signIn: (identifier: string, password: string) => Promise<void>
  signOut: () => void
  clearError: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in and token is valid
  useEffect(() => {
    const storedUser = localStorage.getItem('ghostwrite_user')
    const token = localStorage.getItem('ghostwrite_token')

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('ghostwrite_user')
        localStorage.removeItem('ghostwrite_token')
      }
    }
    setIsLoading(false)
  }, [])

  const signUp = async (name: string, username: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.signUp(name, username, email, password)
      
      // Store user and JWT token
      localStorage.setItem('ghostwrite_user', JSON.stringify(response.user))
      localStorage.setItem('ghostwrite_token', response.token)
      
      setUser(response.user)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Sign up failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (identifier: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Signing in...', identifier)
      const response = await api.signIn(identifier, password)
      
      console.log('Sign in response:', { 
        hasUser: !!response.user, 
        hasToken: !!response.token,
        tokenPreview: response.token?.substring(0, 20) + '...'
      })
      
      // Store user and JWT token
      localStorage.setItem('ghostwrite_user', JSON.stringify(response.user))
      localStorage.setItem('ghostwrite_token', response.token)
      
      console.log('Stored in localStorage:', {
        user: !!localStorage.getItem('ghostwrite_user'),
        token: !!localStorage.getItem('ghostwrite_token')
      })
      
      setUser(response.user)
    } catch (err: any) {
      console.error('Sign in error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Sign in failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('ghostwrite_user')
    localStorage.removeItem('ghostwrite_token')
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data }
      setUser(updated)
      localStorage.setItem('ghostwrite_user', JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        error,
        signUp, 
        signIn, 
        signOut,
        clearError,
        updateUser
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

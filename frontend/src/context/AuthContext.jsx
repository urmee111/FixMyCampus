import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'
import { MOCK_USERS } from '../data/mockData'
import { clearAuthSession, getAuthToken, getAuthUser, setAuthToken, setAuthUser, USE_MOCK_API } from '../api/client'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getAuthToken())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = getAuthToken()
        if (!storedToken) return

        const storedUser = getAuthUser()
        if (storedUser) {
          setUser(storedUser)
          setToken(storedToken)
        } else if (USE_MOCK_API) {
          const res = await authApi.getCurrentUser()
          if (res.data?.user) {
            setUser(res.data.user)
            setAuthUser(res.data.user)
            setToken(storedToken)
          }
        } else {
          clearAuthSession()
          setToken(null)
        }
      } catch {
        clearAuthSession()
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()

    const handleUnauthorized = () => {
      setUser(null)
      setToken(null)
    }
    window.addEventListener('fixmycampus:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('fixmycampus:unauthorized', handleUnauthorized)
  }, [])

  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(credentials)
      if (res.data?.user) {
        setUser(res.data.user)
        setToken(res.data.token)
      }
      return res
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (formData) => {
    setIsLoading(true)
    try {
      const res = await authApi.signup(formData)
      if (res.data?.user) {
        setUser(res.data.user)
        setToken(res.data.token)
      }
      return res
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    setToken(null)
  }

  // Developer helper to seamlessly preview student vs admin experiences
  const switchRole = (role) => {
    if (!USE_MOCK_API) return
    const nextUser = role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.student
    const nextToken = `mock-token-${nextUser.role}`
    setUser(nextUser)
    setToken(nextToken)
    setAuthUser(nextUser)
    setAuthToken(nextToken)
  }

  const isAuthenticated = Boolean(user && token)
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
        canPreviewRole: USE_MOCK_API,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

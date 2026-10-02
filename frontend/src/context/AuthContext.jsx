import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'
import { getAuthToken, getAuthUser } from '../api/client'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // The session (token + user) is kept in localStorage by api/client.js. A wrong or expired token
  // is detected by the first API call: a 401 there logs the user out (see the event below).
  const [token, setToken] = useState(() => getAuthToken())
  const [user, setUser] = useState(() => (getAuthToken() ? getAuthUser() : null))

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      setToken(null)
    }
    window.addEventListener('fixmycampus:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('fixmycampus:unauthorized', handleUnauthorized)
  }, [])

  const login = async (credentials) => {
    const res = await authApi.login(credentials)
    setUser(res.data.user)
    setToken(res.data.token)
    return res
  }

  const signup = async (formData) => {
    const res = await authApi.signup(formData)
    setUser(res.data.user)
    setToken(res.data.token)
    return res
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    setToken(null)
  }

  const isAuthenticated = Boolean(user && token)
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, signup, logout }}>
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

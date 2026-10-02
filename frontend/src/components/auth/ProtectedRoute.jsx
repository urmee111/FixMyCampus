import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Not logged in -> /login (and come back here after logging in).
// adminOnly: a student who opens an admin page is sent to /issues.
// (This only hides pages. The backend still checks the role on every admin request.)
export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/issues" replace />
  }

  return children
}

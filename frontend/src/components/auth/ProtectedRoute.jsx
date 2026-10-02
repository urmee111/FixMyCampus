import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner'
import { ErrorState } from '../ui/ErrorState'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'

export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light-canvas dark:bg-surface-dark-canvas">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs font-semibold text-slate-500">Checking campus session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light-canvas dark:bg-surface-dark-canvas p-4">
        <div className="max-w-md w-full">
          <ErrorState
            type="forbidden"
            title="Access restricted"
            message="You don't have permission to view this area."
            action={<Button size="sm" onClick={() => navigate('/issues')}>Back to Issues</Button>}
          />
        </div>
      </div>
    )
  }

  return children
}

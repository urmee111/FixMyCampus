import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/ui/ErrorState'
import { Button } from '../components/ui/Button'
import { Home } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorState
          type="404"
          title="Page Not Found"
          message="The campus page or resource you requested could not be located. It may have moved or been taken offline."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/issues')}
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to Campus Issues
            </Button>
          }
        />
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/navigation/Sidebar'
import { Topbar } from '../components/navigation/Topbar'
import { MobileDrawer, MobileBottomBar } from '../components/navigation/MobileNav'
import { useAuth } from '../hooks/useAuth'
import { ErrorState } from '../components/ui/ErrorState'
import { Button } from '../components/ui/Button'
import { ShieldCheck } from 'lucide-react'

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAdmin, switchRole } = useAuth()

  return (
    <div className="min-h-screen flex bg-surface-light-canvas dark:bg-surface-dark-canvas transition-colors duration-200">
      <Sidebar className="hidden lg:flex" />

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {!isAdmin ? (
            <div className="max-w-md mx-auto py-12">
              <ErrorState
                type="forbidden"
                title="Admin Authentication Required"
                message="You are currently signed in as a student. To test or review the administrative operations dashboard, switch your session persona."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => switchRole('admin')}
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    Switch to Admin View (Demo)
                  </Button>
                }
              />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <MobileBottomBar />
    </div>
  )
}

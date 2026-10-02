import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/navigation/Sidebar'
import { Topbar } from '../components/navigation/Topbar'
import { MobileDrawer, MobileBottomBar } from '../components/navigation/MobileNav'

// Same frame as AppLayout. Who may enter is decided by <ProtectedRoute adminOnly> in App.jsx.
export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <Outlet />
        </main>
      </div>

      <MobileBottomBar />
    </div>
  )
}

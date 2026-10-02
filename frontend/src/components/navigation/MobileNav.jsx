import React from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  Compass,
  FileText,
  PlusCircle,
  LayoutDashboard,
  MapPin,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

export function MobileDrawer({ isOpen, onClose }) {
  const { isAdmin } = useAuth()
  const location = useLocation()

  // Close the drawer after every page change
  React.useEffect(() => {
    onClose()
  }, [location.pathname])

  if (!isOpen) return null

  const studentLinks = [
    { to: '/issues', label: 'Campus Issues', icon: Compass },
    { to: '/my-reports', label: 'My Reports', icon: FileText },
    { to: '/report', label: 'Report Issue', icon: PlusCircle },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/issues', label: 'All Issues', icon: Compass },
    { to: '/admin/locations', label: 'Locations & QR', icon: MapPin },
  ]

  const links = isAdmin ? adminLinks : studentLinks

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col z-10 animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <Link to={isAdmin ? '/admin' : '/issues'} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <polyline points="9 9 11 11 15 7" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Links */}
        <nav aria-label="Main" className="mt-5 space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label + item.to}
                to={item.to}
                end={item.to === '/issues' || item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

const bottomLinkClass = ({ isActive }) =>
  cn(
    'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-medium transition-colors',
    isActive ? 'text-brand-700 dark:text-brand-300 font-bold' : 'text-slate-600 dark:text-slate-400'
  )

export function MobileBottomBar() {
  const { isAdmin } = useAuth()

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-3 flex items-center justify-around lg:hidden transition-colors"
    >
      <NavLink to="/issues" end className={bottomLinkClass}>
        <Compass className="w-5 h-5 stroke-[2]" aria-hidden="true" />
        <span>Issues</span>
      </NavLink>

      {!isAdmin ? (
        <>
          <NavLink to="/report" className={bottomLinkClass}>
            <PlusCircle className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            <span>Report</span>
          </NavLink>

          <NavLink to="/my-reports" className={bottomLinkClass}>
            <FileText className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            <span>My Reports</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/admin" end className={bottomLinkClass}>
            <LayoutDashboard className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/locations" className={bottomLinkClass}>
            <MapPin className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            <span>Locations</span>
          </NavLink>
        </>
      )}
    </nav>
  )
}

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

  React.useEffect(() => {
    onClose()
  }, [location.pathname])

  if (!isOpen) return null

  const studentLinks = [
    { to: '/issues', label: 'Campus Issues', icon: Compass },
    { to: '/my-reports', label: 'My Reported Issues', icon: FileText },
    { to: '/report', label: 'Report New Issue', icon: PlusCircle, isPrimary: true },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Operations Overview', icon: LayoutDashboard },
    { to: '/issues', label: 'All Campus Issues', icon: Compass },
    { to: '/admin/locations', label: 'Locations & QR Codes', icon: MapPin },
  ]

  const links = isAdmin ? adminLinks : studentLinks

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between z-10 animate-slide-down">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <Link to="/issues" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-5 space-y-1.5">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.label + item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            FixMyCampus v1.0 • Operations Platform
          </p>
        </div>
      </div>
    </div>
  )
}

export function MobileBottomBar() {
  const { isAdmin } = useAuth()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 py-1.5 px-3 flex items-center justify-around lg:hidden transition-colors">
      <NavLink
        to="/issues"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors',
            isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          )
        }
      >
        <Compass className="w-5 h-5 stroke-[2]" />
        <span>Issues</span>
      </NavLink>

      {!isAdmin ? (
        <>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-brand-600 dark:text-brand-400'
              )
            }
          >
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center -mt-4 shadow-md shadow-brand-600/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span>Report</span>
          </NavLink>

          <NavLink
            to="/my-reports"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              )
            }
          >
            <FileText className="w-5 h-5 stroke-[2]" />
            <span>My Reports</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              )
            }
          >
            <LayoutDashboard className="w-5 h-5 stroke-[2]" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/admin/locations"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              )
            }
          >
            <MapPin className="w-5 h-5 stroke-[2]" />
            <span>Locations</span>
          </NavLink>
        </>
      )}
    </nav>
  )
}

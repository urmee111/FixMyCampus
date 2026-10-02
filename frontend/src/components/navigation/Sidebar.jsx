import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Compass,
  FileText,
  PlusCircle,
  LayoutDashboard,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

export function Sidebar({ className }) {
  const { isAdmin } = useAuth()

  // Students: browse, report, follow their own reports. Staff / Admin: dashboard and moderation.
  const studentLinks = [
    { to: '/issues', label: 'Campus Issues', icon: Compass },
    { to: '/my-reports', label: 'My Reports', icon: FileText },
    { to: '/report', label: 'Report Issue', icon: PlusCircle, isPrimary: true },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/issues', label: 'All Issues', icon: Compass },
    { to: '/admin/locations', label: 'Locations & QR', icon: MapPin },
  ]

  const navLinks = isAdmin ? adminLinks : studentLinks

  return (
    <aside
      className={cn(
        'w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-4 shrink-0 transition-colors',
        className
      )}
    >
      {/* Logo brand header */}
      <Link to={isAdmin ? '/admin' : '/issues'} className="flex items-center gap-2.5 px-3 py-2 mb-6 group rounded-xl">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-150">
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
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
          </span>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 -mt-0.5">
            {isAdmin ? 'Staff / Admin' : 'Student'}
          </span>
        </div>
      </Link>

      <nav aria-label="Main" className="space-y-1">
        {navLinks.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label + item.to}
              to={item.to}
              end={item.to === '/issues' || item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
                  item.isPrimary && !isActive && 'text-brand-700 dark:text-brand-300'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0 stroke-[2]" aria-hidden="true" />
              <span className="flex-1 truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

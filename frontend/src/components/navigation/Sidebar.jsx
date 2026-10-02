import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Compass,
  FileText,
  PlusCircle,
  LayoutDashboard,
  BarChart3,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

export function Sidebar({ className }) {
  const { isAdmin } = useAuth()

  const studentLinks = [
    { to: '/issues', label: 'Campus Issues', icon: Compass },
    { to: '/my-reports', label: 'My Reports', icon: FileText },
    { to: '/report', label: 'Report Issue', icon: PlusCircle, isPrimary: true },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/issues', label: 'All Issues', icon: Compass },
    { to: '/admin', label: 'Statistics', icon: BarChart3 },
    { to: '/admin/locations', label: 'Locations & QR', icon: MapPin },
  ]

  const navLinks = isAdmin ? adminLinks : studentLinks

  return (
    <aside
      className={cn(
        'w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 flex flex-col justify-between p-4 shrink-0 transition-colors',
        className
      )}
    >
      <div>
        {/* Logo brand header */}
        <Link to="/issues" className="flex items-center gap-2.5 px-3 py-2 mb-6 group">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/30 group-hover:scale-105 transition-transform duration-150">
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
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-0.5">
              {isAdmin ? 'Operations Admin' : 'Campus Portal'}
            </span>
          </div>
        </Link>

        {/* Section title */}
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {isAdmin ? 'Administration' : 'Menu'}
        </p>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label + item.to}
                to={item.to}
                end={item.to === '/issues' || item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200',
                    item.isPrimary &&
                      !isActive &&
                      'text-brand-600 dark:text-brand-400 font-bold bg-brand-50/40 dark:bg-brand-950/20'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[2]" />
                <span className="flex-1 truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer info pill */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 px-2 space-y-2">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Campus Ops Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">
            {isAdmin ? 'Full triage permissions enabled' : 'Report response time ~28h'}
          </p>
        </div>
      </div>
    </aside>
  )
}

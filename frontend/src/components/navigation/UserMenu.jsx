import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Avatar } from '../ui/Avatar'
import { LogOut, Shield, User, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { formatRole } from '../../lib/formatters'

export function UserMenu({ className }) {
  const { user, logout, isAdmin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-sm font-semibold px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        Log in
      </button>
    )
  }

  const handleLogout = async () => {
    await logout()
    toast.info('You have been signed out.')
    navigate('/login')
  }

  const go = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  const itemClass =
    'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left'

  return (
    <div className={cn('relative inline-block', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Avatar name={user.name} size="xs" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-scale-in"
        >
          {/* Who is signed in (real data from the login response) */}
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {isAdmin ? (
                <Shield className="w-3 h-3" aria-hidden="true" />
              ) : (
                <User className="w-3 h-3" aria-hidden="true" />
              )}
              <span>{formatRole(user.role)}</span>
            </div>
          </div>

          <div className="px-2 py-1">
            {isAdmin ? (
              <button type="button" role="menuitem" onClick={() => go('/admin')} className={itemClass}>
                <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <span>Admin Dashboard</span>
              </button>
            ) : (
              <button type="button" role="menuitem" onClick={() => go('/my-reports')} className={itemClass}>
                <User className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <span>My Reports</span>
              </button>
            )}
          </div>

          <div className="px-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

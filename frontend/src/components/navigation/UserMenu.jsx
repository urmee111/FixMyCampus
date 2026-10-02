import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Avatar } from '../ui/Avatar'
import { LogOut, Shield, User, RefreshCw, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function UserMenu({ className }) {
  const { user, logout, switchRole, isAdmin, canPreviewRole } = useAuth()
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
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Sign in
        </button>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    toast.info('You have been signed out.')
    navigate('/login')
  }

  const handleRoleToggle = () => {
    const nextRole = isAdmin ? 'student' : 'admin'
    switchRole(nextRole)
    setIsOpen(false)
    toast.info(`Switched role preview to ${nextRole.toUpperCase()}`)
    if (nextRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/issues')
    }
  }

  return (
    <div className={cn('relative inline-block', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User navigation menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <Avatar src={user.avatar} name={user.name} size="xs" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-scale-in"
        >
          {/* User profile brief */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {isAdmin ? <Shield className="w-2.5 h-2.5 text-amber-500" /> : <User className="w-2.5 h-2.5 text-brand-500" />}
              <span>{user.role}</span>
            </div>
          </div>

          {/* Quick role preview switcher for testing */}
          {canPreviewRole && <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleRoleToggle}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch to {isAdmin ? 'Student' : 'Admin'}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
                Preview
              </span>
            </button>
          </div>}

          {/* Nav links */}
          <div className="px-2 py-1">
            <button
              type="button"
              onClick={() => {
                navigate('/my-reports')
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>My Reported Issues</span>
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  navigate('/admin')
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Operations</span>
              </button>
            )}
          </div>

          {/* Logout */}
          <div className="px-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

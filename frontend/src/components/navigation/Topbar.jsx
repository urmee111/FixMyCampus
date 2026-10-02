import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Plus } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function Topbar({ onOpenMobileMenu }) {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small screen brand mark */}
        <Link to="/issues" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <svg
              className="w-3.5 h-3.5"
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
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
          </span>
        </Link>
      </div>

      {/* Center / Search quick trigger */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
        <button
          type="button"
          onClick={() => navigate('/issues')}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search campus issues, rooms, categories...</span>
          </div>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
            /
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!isAdmin && (
          <Button
            size="sm"
            onClick={() => navigate('/report')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="hidden sm:inline-flex"
          >
            Report Issue
          </Button>
        )}

        <ThemeToggle />

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <UserMenu />
      </div>
    </header>
  )
}

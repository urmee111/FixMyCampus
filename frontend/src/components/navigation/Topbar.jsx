import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Menu, Search, Plus, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { SearchInput } from '../ui/SearchInput'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

const SEARCH_DELAY_MS = 400

// True when the keyboard focus is somewhere you can type (so "/" must stay a normal character there)
function isTypingTarget(element) {
  if (!element) return false
  const tag = element.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable
}

export function Topbar({ onOpenMobileMenu }) {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  // The URL is the single source of truth for the search text: /issues?q=<text>.
  // Anywhere else the box is simply empty.
  const onIssuesPage = pathname === '/issues'
  const urlQuery = onIssuesPage ? searchParams.get('q') || '' : ''

  const [text, setText] = useState(urlQuery)
  const [mobileOpen, setMobileOpen] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  // Follow the URL (back/forward buttons, "Clear filters", links from other pages)
  // (If the text only differs by spaces we keep it, otherwise the space you just typed would vanish.)
  useEffect(() => {
    setText((current) => (current.trim() === urlQuery ? current : urlQuery))
  }, [urlQuery])

  // A pending debounced search must not fire after we left the page or unmounted
  useEffect(() => () => clearTimeout(timerRef.current), [pathname])

  // Writes q into the URL. On /issues it keeps every other filter and goes back to page 1.
  const applySearch = useCallback(
    (value, { replace }) => {
      const query = value.trim()
      if (onIssuesPage) {
        if (query === urlQuery) return
        const next = new URLSearchParams(searchParams)
        if (query) next.set('q', query)
        else next.delete('q')
        next.delete('page')
        setSearchParams(next, { replace })
      } else if (query) {
        navigate(`/issues?q=${encodeURIComponent(query)}`)
      }
    },
    [onIssuesPage, urlQuery, searchParams, setSearchParams, navigate]
  )

  // The timer calls the newest version of applySearch, so it never works with an old copy of the URL
  const applyRef = useRef(applySearch)
  useEffect(() => {
    applyRef.current = applySearch
  })

  const handleChange = (event) => {
    const value = event.target.value
    setText(value)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => applyRef.current(value, { replace: true }), SEARCH_DELAY_MS)
  }

  const clearSearch = () => {
    clearTimeout(timerRef.current)
    setText('')
    applySearch('', { replace: false })
    inputRef.current?.focus()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      clearTimeout(timerRef.current)
      applySearch(text, { replace: false })
      setMobileOpen(false)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      clearSearch()
      setMobileOpen(false)
    }
  }

  // "/" focuses the search box when you are not typing somewhere else
  useEffect(() => {
    const handleSlash = (event) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
      if (isTypingTarget(document.activeElement)) return
      event.preventDefault()
      setMobileOpen(true)
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', handleSlash)
    return () => window.removeEventListener('keydown', handleSlash)
  }, [])

  // On phones the box is hidden until the search icon is pressed: focus it as soon as it shows up
  useEffect(() => {
    if (mobileOpen) inputRef.current?.focus()
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3 transition-colors">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Small screen brand mark */}
        <Link to={isAdmin ? '/admin' : '/issues'} className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <svg
              className="w-3.5 h-3.5"
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
          <span className="hidden min-[420px]:inline text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
          </span>
        </Link>
      </div>

      {/* Search: always visible from the sm breakpoint up. On phones it opens from the search icon and covers the bar. */}
      <div
        role="search"
        className={cn(
          mobileOpen
            ? 'absolute inset-0 z-40 flex items-center gap-2 px-4 bg-white dark:bg-slate-900'
            : 'hidden sm:flex flex-1 max-w-md mx-2'
        )}
      >
        <SearchInput
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onClear={clearSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search issues…  ( / )"
          aria-label="Search issues"
        />
        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close search"
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Right: Actions, Theme, User */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Search issues"
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* The ONE "Report Issue" button of the app (sidebar, page headers and mobile menus do not repeat it).
            On phones it is an icon-only "+" button; the aria-label keeps the name for screen readers. */}
        {!isAdmin && (
          <Button
            size="sm"
            onClick={() => navigate('/report')}
            aria-label="Report Issue"
            leftIcon={<Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />}
            className="max-sm:w-9 max-sm:min-h-9 max-sm:px-0 max-sm:gap-0"
          >
            <span className="hidden sm:inline">Report Issue</span>
          </Button>
        )}

        <ThemeToggle />

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <UserMenu />
      </div>
    </header>
  )
}

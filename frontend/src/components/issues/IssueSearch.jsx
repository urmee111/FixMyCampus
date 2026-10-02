import React, { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function IssueSearch({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search issues, locations, or defect keywords...',
  className,
}) {
  const inputRef = useRef(null)

  // Global shortcut: Ctrl+K or Cmd+K focuses search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search campus issues"
        className={cn(
          'w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-150',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'pl-10 pr-16 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
          'hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
        )}
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search query"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </div>
    </div>
  )
}

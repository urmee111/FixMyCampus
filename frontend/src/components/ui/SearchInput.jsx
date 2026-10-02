import React, { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'

// A search box with a clear (x) button. The parent owns the text (value) and decides what "clear" means.
export const SearchInput = forwardRef(function SearchInput(
  {
    value,
    onChange,
    onClear,
    placeholder = 'Search issues...',
    className,
    inputClassName,
    ...props
  },
  ref
) {
  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-600 dark:text-slate-400 pointer-events-none" aria-hidden="true" />
      <input
        ref={ref}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 transition-colors duration-150',
          'placeholder:text-slate-500 dark:placeholder:text-slate-500',
          'pl-10 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
          'hover:border-slate-300 dark:hover:border-slate-700',
          inputClassName
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
})

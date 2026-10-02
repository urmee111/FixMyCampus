import React, { useState, forwardRef } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

export const PasswordInput = forwardRef(function PasswordInput(
  {
    id,
    value,
    onChange,
    placeholder = '••••••••••••',
    error,
    disabled = false,
    className,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
        <Lock className="w-4 h-4" />
      </div>
      <input
        ref={ref}
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-sm rounded-xl border transition-all duration-150',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
          'pl-10 pr-10 py-2.5',
          error
            ? 'border-rose-300 dark:border-rose-700/80 focus:ring-rose-500/20 focus:border-rose-500'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
          disabled && 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800',
          className
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  )
})

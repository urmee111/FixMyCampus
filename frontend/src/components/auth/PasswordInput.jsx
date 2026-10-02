import React, { useState, forwardRef } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

export const PasswordInput = forwardRef(function PasswordInput(
  {
    id,
    value,
    onChange,
    placeholder = '••••••••',
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
      <div className="absolute left-3.5 text-slate-600 dark:text-slate-400 pointer-events-none flex items-center justify-center">
        <Lock className="w-4 h-4" aria-hidden="true" />
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
          'w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm rounded-xl border transition-colors duration-150',
          'placeholder:text-slate-500 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
          'pl-10 pr-11 py-2.5',
          error
            ? 'border-red-400 dark:border-red-700/80 focus:ring-red-500/30 focus:border-red-500'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
          disabled && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed',
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-pressed={showPassword}
        disabled={disabled}
        className="absolute right-2 p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md transition-colors"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Eye className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
})

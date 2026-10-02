import React from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

export function FormField({
  id,
  label,
  required,
  error,
  helperText,
  children,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </span>
        </label>
      )}

      {children}

      {error ? (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-0.5 animate-slide-down font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p
          id={id ? `${id}-helper` : undefined}
          className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

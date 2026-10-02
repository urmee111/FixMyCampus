import React from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

// Label + input + error/helper text. The child whose id matches `id` is automatically linked to the
// message (aria-describedby) and marked as required for screen readers.
export function FormField({
  id,
  label,
  required,
  error,
  helperText,
  children,
  className,
}) {
  const messageId = error ? `${id}-error` : helperText ? `${id}-helper` : undefined

  const linkedChildren = id
    ? React.Children.map(children, (child) =>
        React.isValidElement(child) && child.props.id === id
          ? React.cloneElement(child, {
              'aria-describedby': messageId,
              'aria-required': required ? true : undefined,
            })
          : child
      )
    : children

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
        >
          <span>
            {label}
            {required && (
              <span className="text-red-600 dark:text-red-400 ml-1 font-bold" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>
      )}

      {linkedChildren}

      {error ? (
        <p
          id={messageId}
          role="alert"
          className="text-xs text-red-700 dark:text-red-400 flex items-center gap-1.5 mt-0.5 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

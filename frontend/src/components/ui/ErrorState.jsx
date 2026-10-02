import React from 'react'
import { AlertCircle, RotateCcw, ShieldAlert, FileQuestion } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

export function ErrorState({
  type = 'generic', // 'generic' | '404' | 'forbidden'
  title,
  message,
  onRetry,
  action,
  className,
}) {
  const configs = {
    generic: {
      icon: AlertCircle,
      iconClass: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
      title: title || 'Something went wrong',
      message: message || "We couldn't load this information right now. Please try again.",
    },
    '404': {
      icon: FileQuestion,
      iconClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      title: title || 'Resource not found',
      message: message || 'The item you are looking for does not exist or may have been deleted.',
    },
    forbidden: {
      icon: ShieldAlert,
      iconClass: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-900',
      title: title || 'Access Restricted',
      message: message || 'You do not have administrative permissions to view this section.',
    },
  }

  const current = configs[type] || configs.generic
  const Icon = current.icon

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs',
        className
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center border mb-4',
          current.iconClass
        )}
      >
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {current.title}
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">
        {current.message}
      </p>

      <div className="mt-5 flex items-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        )}
        {action}
      </div>
    </div>
  )
}

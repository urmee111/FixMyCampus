import React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '../../lib/utils'

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records matching your current criteria.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-500 flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-slate-700/80 mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

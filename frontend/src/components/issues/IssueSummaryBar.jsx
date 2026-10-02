import React from 'react'
import { CircleDot, Clock, CheckCircle2, Layers } from 'lucide-react'
import { cn } from '../../lib/utils'

// Status counts. `counts` is what GET /my/issues returns: { Open, "In Progress", Resolved, total }.
export function IssueSummaryBar({ counts, className }) {
  if (!counts) return null

  const items = [
    {
      label: 'Total reports',
      count: counts.total,
      icon: Layers,
      color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Open',
      count: counts.Open,
      icon: CircleDot,
      color: 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      label: 'In Progress',
      count: counts['In Progress'],
      icon: Clock,
      color: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      label: 'Resolved',
      count: counts.Resolved,
      icon: CheckCircle2,
      color: 'text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-950/60',
    },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs',
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="flex items-center gap-3 p-1.5">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', item.color)}>
              <Icon className="w-4 h-4 stroke-[2]" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {item.count}
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

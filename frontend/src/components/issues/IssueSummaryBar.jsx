import React from 'react'
import { CircleDot, Clock, CheckCircle2, Layers } from 'lucide-react'
import { cn } from '../../lib/utils'

export function IssueSummaryBar({ stats, className }) {
  if (!stats) return null

  const items = [
    {
      label: 'Total Reports',
      count: stats.total,
      icon: Layers,
      color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Open',
      count: stats.open,
      icon: CircleDot,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      label: 'In Progress',
      count: stats.inProgress,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      label: 'Resolved',
      count: stats.resolved,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xs shadow-2xs',
        className
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon
        return (
          <div key={idx} className="flex items-center gap-3 p-1.5">
            <div
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150',
                item.color
              )}
            >
              <Icon className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {item.count}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

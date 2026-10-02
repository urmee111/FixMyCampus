import React from 'react'
import { cn } from '../../lib/utils'

// Two small charts drawn with plain HTML and Tailwind (no chart package).
// Every number is also written as text, so nothing depends on colour alone.

// Horizontal bars. items: [{ label, value, href? }]. The longest bar is 100% wide.
export function BarList({ items, unit = '', barClassName = 'bg-brand-600', label }) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <ul className="space-y-3" aria-label={label}>
      {items.map((item) => (
        <li key={item.label} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.label}</span>
            <span className="text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
              {item.value}
              {unit}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden" aria-hidden="true">
            <div className={cn('h-full rounded-full', barClassName)} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

// One stacked bar split into parts. parts: [{ label, value, className }] and a legend with the numbers below it.
export function StackedBar({ parts, label }) {
  const total = parts.reduce((sum, part) => sum + part.value, 0)
  return (
    <div>
      <div
        role="img"
        aria-label={`${label}: ${parts.map((part) => `${part.label} ${part.value}`).join(', ')}`}
        className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        {total > 0 &&
          parts.map((part) => (
            <div
              key={part.label}
              className={part.className}
              style={{ width: `${(part.value / total) * 100}%` }}
            />
          ))}
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {parts.map((part) => (
          <li key={part.label} className="text-sm">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', part.className)} aria-hidden="true" />
              {part.label}
            </span>
            <span className="block text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {part.value}
              {total > 0 && (
                <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {Math.round((part.value / total) * 100)}%
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

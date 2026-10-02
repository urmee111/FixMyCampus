import React from 'react'
import { STATUSES, STATUS_CONFIG } from '../../lib/constants'
import { cn } from '../../lib/utils'

export function StatusBadge({ status = STATUSES.OPEN, size = 'md', className }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[STATUSES.OPEN]

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }

  const renderIndicator = () => {
    switch (status) {
      case STATUSES.OPEN:
        return (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
          </span>
        )
      case STATUSES.IN_PROGRESS:
        return (
          <span className="inline-flex items-center justify-center h-2.5 w-2.5 text-amber-600 dark:text-amber-400 font-bold leading-none text-[10px]">
            ◐
          </span>
        )
      case STATUSES.RESOLVED:
        return (
          <span className="inline-flex items-center justify-center h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400 font-bold leading-none text-[11px]">
            ✓
          </span>
        )
      default:
        return <span className={cn('h-2 w-2 rounded-full', config.dotClass)} />
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border select-none transition-colors duration-150',
        config.badgeClass,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {renderIndicator()}
      <span className="tracking-tight">{config.label}</span>
    </span>
  )
}

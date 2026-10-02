import React from 'react'
import { CircleDot, Clock, CheckCircle2 } from 'lucide-react'
import { STATUSES, STATUS_CONFIG } from '../../lib/constants'
import { cn } from '../../lib/utils'

const STATUS_ICONS = {
  [STATUSES.OPEN]: CircleDot,
  [STATUSES.IN_PROGRESS]: Clock,
  [STATUSES.RESOLVED]: CheckCircle2,
}

// Open = blue, In Progress = amber, Resolved = green. The icon and the word also say it, so colour is never the only clue.
export function StatusBadge({ status = STATUSES.OPEN, size = 'md', className }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[STATUSES.OPEN]
  const Icon = STATUS_ICONS[status] || CircleDot

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border select-none whitespace-nowrap',
        config.badgeClass,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

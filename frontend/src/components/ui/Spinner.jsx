import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Spinner({ size = 'md', className }) {
  const sizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  }

  return (
    <Loader2
      className={cn(
        'animate-spin text-brand-600 dark:text-brand-400',
        sizes[size] || sizes.md,
        className
      )}
      aria-label="Loading"
    />
  )
}

import React, { useState } from 'react'
import { cn } from '../../lib/utils'

export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className,
}) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }

  const getInitials = (str) => {
    if (!str) return '?'
    const parts = str.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const showImage = src && !imageError

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold ring-1 ring-slate-900/5 dark:ring-white/10',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}

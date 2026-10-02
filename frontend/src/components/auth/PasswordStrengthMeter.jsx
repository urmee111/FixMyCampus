import React from 'react'
import { cn } from '../../lib/utils'

export function calculatePasswordStrength(password = '') {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 8) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password) || (/[A-Z]/.test(password) && /[a-z]/.test(password))) {
    score += 1
  }

  const levels = [
    { label: 'Too weak', color: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
    { label: 'Weak', color: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
    { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { label: 'Good', color: 'bg-brand-500', text: 'text-brand-600 dark:text-brand-400' },
    { label: 'Strong password', color: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
  ]

  const current = levels[score] || levels[0]

  return {
    score,
    label: current.label,
    color: current.color,
    textColor: current.text,
  }
}

export function PasswordStrengthMeter({ password = '', className }) {
  if (!password) return null

  const { score, label, color, textColor } = calculatePasswordStrength(password)

  return (
    <div className={cn('space-y-1.5 mt-1.5 animate-fade-in', className)}>
      <div className="flex gap-1.5 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              'flex-1 rounded-full transition-all duration-300',
              step <= score ? color : 'bg-slate-200 dark:bg-slate-800'
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className={cn('font-semibold', textColor)}>{label}</span>
        <span className="text-slate-600">Min 6 characters</span>
      </div>
    </div>
  )
}

import React from 'react'
import { GraduationCap, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'

// The two roles of the app. "admin" is called "Staff / Admin" on screen.
const ROLES = [
  { id: 'student', label: 'Student', description: 'Report and upvote issues', icon: GraduationCap },
  { id: 'admin', label: 'Staff / Admin', description: 'Manage issue status', icon: ShieldCheck },
]

export function RoleSelector({ role, onChange, disabled = false, error, className }) {
  return (
    <fieldset className={cn('space-y-2', className)} disabled={disabled}>
      <legend className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        I am a <span className="text-red-600 dark:text-red-400 font-bold" aria-hidden="true">*</span>
      </legend>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((item) => {
          const Icon = item.icon
          const isSelected = role === item.id

          return (
            <label
              key={item.id}
              className={cn(
                'relative flex flex-col gap-1 p-3 rounded-xl border cursor-pointer transition-colors select-none',
                'focus-within:ring-2 focus-within:ring-brand-500/50',
                isSelected
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/50 dark:border-brand-500'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-500',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                name="role"
                value={item.id}
                checked={isSelected}
                onChange={() => onChange(item.id)}
                className="sr-only"
              />
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Icon className="w-4 h-4" aria-hidden="true" />
                {item.label}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">{item.description}</span>
            </label>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-700 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </fieldset>
  )
}

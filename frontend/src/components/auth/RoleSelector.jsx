import React from 'react'
import { GraduationCap, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'

export function RoleSelector({ role, onChange, className }) {
  const roles = [
    {
      id: 'student',
      label: 'Student',
      description: 'Report faults, upvote urgent issues & track repairs across campus.',
      icon: GraduationCap,
      badge: 'Campus Body',
    },
    {
      id: 'admin',
      label: 'Facilities Admin',
      description: 'Review incoming tickets, assign contractors & update progress.',
      icon: ShieldCheck,
      badge: 'Staff / Operations',
    },
  ]

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
          Account Role <span className="text-rose-500 font-bold">*</span>
        </label>
        <span className="text-[10px] text-slate-400">Verified via campus identity</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles.map((item) => {
          const Icon = item.icon
          const isSelected = role === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'relative flex flex-col p-3.5 rounded-2xl border text-left transition-all duration-150 ease-out select-none',
                isSelected
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={cn(
                    'p-2 rounded-xl shrink-0',
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                    isSelected
                      ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  )}
                >
                  {item.badge}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {item.label}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {item.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

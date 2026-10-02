import React from 'react'
import { cn } from '../../lib/utils'

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex max-w-full items-center overflow-x-auto scrollbar-none p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none flex items-center gap-1.5',
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

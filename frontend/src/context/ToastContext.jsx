import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export const ToastContext = createContext(null)

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const TOAST_STYLES = {
  success: 'bg-white dark:bg-slate-900 border-green-200 dark:border-green-800/60 text-green-900 dark:text-green-200',
  error: 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200',
  warning: 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200',
  info: 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200',
}

const ICON_COLORS = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    const newToast = { id, type, title, message, duration }

    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [removeToast])

  // One stable object, so pages can use `toast` inside effects without re-running them on every render
  const toast = useMemo(
    () => ({
      success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
      error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
      warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
      info: (message, title = 'Notice') => addToast({ type: 'info', title, message }),
      dismiss: removeToast,
    }),
    [addToast, removeToast]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Container */}
      <div
        aria-live="polite"
        className="fixed bottom-20 lg:bottom-5 inset-x-0 sm:inset-x-auto sm:right-5 z-50 flex flex-col gap-2.5 sm:max-w-md sm:w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => {
          const Icon = TOAST_ICONS[item.type] || Info
          return (
            <div
              key={item.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-toast-in ${TOAST_STYLES[item.type]}`}
            >
              <div className={`mt-0.5 shrink-0 ${ICON_COLORS[item.type]}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                {item.title && (
                  <h4 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                )}
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
                  {item.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                aria-label="Dismiss notification"
                className="shrink-0 p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

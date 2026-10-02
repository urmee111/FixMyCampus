import React, { useLayoutEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  className,
}) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()

  useLayoutEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useLayoutEffect(() => {
    if (!isOpen) return

    const restoreTarget = document.activeElement
    const firstControl = panelRef.current?.querySelector(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )
    ;(firstControl || panelRef.current)?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.()
        return
      }

      if (e.key === 'Tab') {
        const controls = panelRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
        if (!controls?.length) {
          e.preventDefault()
          panelRef.current?.focus()
          return
        }
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      restoreTarget?.focus?.()
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog surface */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 animate-scale-in p-6 sm:p-7 max-h-[90vh] flex flex-col',
          maxWidth,
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            {title && (
              <h3 id={titleId} className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h3>
            )}
            {description && (
              <p id={descriptionId} className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 -mr-1.5 -mt-1.5 text-slate-600 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  )
}

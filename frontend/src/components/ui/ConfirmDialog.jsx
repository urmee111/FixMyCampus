import React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

// "Are you sure?" popup. The title and description are given to the Modal, so screen readers announce them.
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={isLoading ? undefined : onClose} title={title} description={description} maxWidth="max-w-md">
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={isDestructive ? 'danger' : 'primary'}
          isLoading={isLoading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

// "Are you sure?" popup (plan: confirm before delete).
//   <ConfirmDialog open={showConfirm} title="Delete this issue?" message="This cannot be undone."
//                  confirmLabel="Delete" danger loading={deleting}
//                  onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
//
// Uses the browser's built-in <dialog>: it traps the keyboard focus, closes on Esc,
// and screen readers treat it as a real dialog, so we get accessibility for free.

import { useEffect, useRef } from 'react';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  // Open / close the native dialog whenever the `open` prop changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-dialog-title"
      // Esc key: let the parent decide (it sets open=false, and the effect above closes the dialog)
      onCancel={(event) => {
        event.preventDefault();
        if (!loading) onCancel();
      }}
      // Click on the dark backdrop (the <dialog> itself, not the content) cancels too
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
      className="m-auto w-full max-w-md rounded-lg bg-white p-0 text-slate-900 shadow-xl backdrop:bg-black/50 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        {message && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{message}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

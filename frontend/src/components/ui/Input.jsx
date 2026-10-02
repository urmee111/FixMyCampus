// Text input with a label and an inline error message.
//   <Input label="Email" type="email" value={email} onChange={...} error={errors.email} />
// The label is linked to the input (htmlFor/id) and the error is announced to screen readers.

import { useId } from 'react';

export default function Input({ label, error, hint, id, className = '', ...props }) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 ${
          error ? 'border-red-600 dark:border-red-400' : 'border-slate-300 dark:border-slate-700'
        }`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

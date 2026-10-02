// Multi-line text box with a label, an inline error and an optional character counter.
//   <Textarea label="Comment" maxLength={500} value={text} onChange={...} error={errors.text} />
// The counter ("12/500") shows when you pass both `maxLength` and a string `value`.

import { useId } from 'react';

export default function Textarea({ label, error, hint, id, className = '', rows = 4, ...props }) {
  const autoId = useId();
  const textareaId = id || autoId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const showCount = props.maxLength && typeof props.value === 'string';

  return (
    <div className={className}>
      <label htmlFor={textareaId} className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 ${
          error ? 'border-red-600 dark:border-red-400' : 'border-slate-300 dark:border-slate-700'
        }`}
        {...props}
      />
      <div className="mt-1 flex justify-between gap-2">
        <div>
          {hint && !error && (
            <p id={hintId} className="text-xs text-slate-600 dark:text-slate-400">
              {hint}
            </p>
          )}
          {error && (
            <p id={errorId} role="alert" className="text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        {showCount && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {props.value.length}/{props.maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

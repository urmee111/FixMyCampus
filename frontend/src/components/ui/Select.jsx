// Dropdown with a label and an inline error message.
// `options` can be plain strings or { value, label } objects.
//   <Select label="Category" options={CATEGORIES} placeholder="Choose a category"
//           value={category} onChange={...} error={errors.category} />

import { useId } from 'react';

export default function Select({ label, options = [], placeholder, error, hint, id, className = '', ...props }) {
  const autoId = useId();
  const selectId = id || autoId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className={className}>
      <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-900 dark:text-slate-100 ${
          error ? 'border-red-600 dark:border-red-400' : 'border-slate-300 dark:border-slate-700'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const text = typeof option === 'string' ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
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

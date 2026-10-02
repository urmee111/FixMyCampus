// Button with variants, sizes and a loading state.
//   <Button>Save</Button>
//   <Button variant="danger" onClick={...}>Delete</Button>
//   <Button type="submit" loading={saving}>Report issue</Button>
//
// While `loading` is true the button is disabled and shows a spinner,
// which prevents double-submits (plan Section 7, Frontend).

import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
};

const SIZES = {
  sm: 'min-h-8 px-3 text-sm',
  md: 'min-h-10 px-4 text-sm',
  lg: 'min-h-11 px-5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button', // "button" by default so it never submits a form by accident
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" label="Loading" className="text-current" />}
      {children}
    </button>
  );
}

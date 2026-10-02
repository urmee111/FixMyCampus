// Shown when loading data failed. Pass `onRetry` to show a "Try again" button.
//   <ErrorState message={getErrorMessage(error)} onRetry={loadIssues} />

import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/40"
    >
      <AlertTriangle aria-hidden="true" className="h-10 w-10 text-red-600 dark:text-red-400" />
      <h2 className="mt-3 text-lg font-semibold text-red-900 dark:text-red-200">{title}</h2>
      {message && <p className="mt-1 max-w-md text-sm text-red-800 dark:text-red-300">{message}</p>}
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

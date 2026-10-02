// Loading spinner. `label` is read aloud by screen readers.
//   <Spinner />   <Spinner size="sm" />   <Spinner size="lg" label="Loading issues" />

import { Loader2 } from 'lucide-react';

const SIZES = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export default function Spinner({ size = 'md', label = 'Loading', className = '' }) {
  return (
    <span role="status" className={`inline-flex items-center ${className}`}>
      <Loader2 aria-hidden="true" className={`animate-spin text-blue-600 dark:text-blue-400 ${SIZES[size]}`} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

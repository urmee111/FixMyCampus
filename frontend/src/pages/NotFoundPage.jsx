// Shown for any URL that doesn't match a route (the `*` route in App.jsx).

import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={SearchX}
      title="Page not found"
      message="The page you are looking for does not exist or was moved."
      action={
        <Link
          to="/issues"
          className="inline-flex min-h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to issues
        </Link>
      }
    />
  );
}

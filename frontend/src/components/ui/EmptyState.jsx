// Shown when a list has nothing to show (plan: every page needs loading, empty and error states).
//   <EmptyState title="No issues found" message="Try another filter." action={<Button>Clear filters</Button>} />

import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
      <Icon aria-hidden="true" className="h-10 w-10 text-slate-500 dark:text-slate-400" />
      <h2 className="mt-3 text-lg font-semibold">{title}</h2>
      {message && <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

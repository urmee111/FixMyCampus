// Gray pulsing placeholder shown while data loads (better than a blank page).
// Size it with classes:  <Skeleton className="h-4 w-1/2" />   <Skeleton className="h-32 w-full" />

export default function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

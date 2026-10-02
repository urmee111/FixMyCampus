// TODO (Member B, Section 10): the search bar + filters on /issues.
// Search box (debounce with useDebounce, 400 ms), category select, status select, location box,
// sort select (upvotes / newest / oldest) and a "Clear filters" button.
// Props: filters (object), onChange(newFilters)

export default function IssueFilters({ filters, onChange }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      IssueFilters
    </div>
  );
}

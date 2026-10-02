// TODO (Member B, Section 8): SOFT warning on the report form. It never blocks submitting.
// Text: "Similar issue already reported here. Upvote it instead?" + links to each similar issue
// (title, status, upvote count) + a "Report anyway" button.
// The parent calls getSimilarIssues({ title, category, building }) debounced 400 ms (useDebounce).
// Props: similarIssues (array), onReportAnyway

export default function DuplicateWarning({ similarIssues, onReportAnyway }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      DuplicateWarning
    </div>
  );
}

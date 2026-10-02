// TODO (Member B, Section 10): Previous / Next buttons + "Page 2 of 5" under the issue list.
// Disable Previous on page 1 and Next on the last page. Wrap in <nav aria-label="Pagination">.
// Props: page, totalPages, onPageChange(newPage)

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      Pagination
    </div>
  );
}

// TODO (Member C, Section 10): the most upvoted issues (stats.topUpvoted), each linking to /issues/:id
// with its upvote count. Also reusable for the "hotspot" locations list (stats.topLocations).
// Props: issues (array of { id, title, upvoteCount })

export default function TopIssuesList({ issues }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      TopIssuesList
    </div>
  );
}

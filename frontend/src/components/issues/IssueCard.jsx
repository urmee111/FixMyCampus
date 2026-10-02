// TODO (Member B, Section 10): one issue as a card on the /issues list.
// Show: title (link to /issues/:id), category icon, location, StatusBadge, PriorityBadge,
// upvote count, comment count, and timeAgo(issue.createdAt).
// Props: issue (shape: see mocks/mockData.js)

export default function IssueCard({ issue }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      IssueCard
    </div>
  );
}

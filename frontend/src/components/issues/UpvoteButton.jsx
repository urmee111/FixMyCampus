// TODO (Member B, Section 10): upvote toggle with the count.
// Optimistic update: change the count immediately, call toggleUpvote(issueId), roll back + toast on error.
// Disabled for admins, for the issue owner and for Resolved issues. Use aria-pressed.
// Props: issueId, count, hasUpvoted, disabled, onToggle

export default function UpvoteButton({ issueId, count, hasUpvoted, disabled, onToggle }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      UpvoteButton
    </div>
  );
}

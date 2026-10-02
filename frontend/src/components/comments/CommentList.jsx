// TODO (Member B, Section 10): the comments of an issue, oldest first.
// Each comment: author name, timeAgo(createdAt), the text, and an "Official" badge when the author is an admin.
// Render the text as plain text only (React escapes it). NEVER use dangerouslySetInnerHTML.
// Show an EmptyState when there are no comments.
// Props: comments (array, shape: see mocks/mockData.js)

export default function CommentList({ comments }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      CommentList
    </div>
  );
}

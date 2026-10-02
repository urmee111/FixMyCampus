// TODO (Member B, Section 10): /issues/:id (any logged-in user).
// Load getIssue(id) (useParams). Show full details, the photo (with alt text), <UpvoteButton />,
// <StatusTimeline />, <CommentList /> + <CommentForm />.
// Admin sees: a status control (select + note -> updateStatus) and a delete button.
// Owner sees: edit (only while Open) and delete buttons. Delete needs <ConfirmDialog />.
// Needs loading (skeleton), 404 (EmptyState) and error (ErrorState) states.
// Until the API is ready you can use `mockIssueDetail` from ../mocks/mockData.

export default function IssueDetailPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">IssueDetailPage</h1>
    </section>
  );
}

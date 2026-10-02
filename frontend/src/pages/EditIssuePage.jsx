// TODO (Member B, Section 10): /issues/:id/edit (owner only, only while the issue is Open).
// Load getIssue(id), pre-fill <IssueForm />, submit with updateIssue(id, formData).
// If the issue is not Open (API returns 409 "Only open issues can be edited") or the user is not
// the owner, show a message / redirect back to /issues/:id.

export default function EditIssuePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">EditIssuePage</h1>
    </section>
  );
}

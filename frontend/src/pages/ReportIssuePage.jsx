// TODO (Member B, Section 10): /report (students report issues).
// <IssueForm /> + soft <DuplicateWarning /> (calls getSimilarIssues, debounced 400 ms, needs
// title + category + building) + photo preview.
// Read ?location= from the URL (useSearchParams) to pre-fill the location (QR codes).
// On submit: createIssue(formData), toast success, navigate to /issues/:id. "Report anyway" must always work.

export default function ReportIssuePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">ReportIssuePage</h1>
    </section>
  );
}

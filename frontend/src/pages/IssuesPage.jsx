// TODO (Member B, Section 10): /issues (home, any logged-in user).
// Search bar + filters (<IssueFilters />), sort, a grid of <IssueCard />, <Pagination />.
// Call getIssues({ q, category, status, location, sort, page, limit }) from api/issues.js.
// Needs: skeleton loaders while loading, <EmptyState> "No issues found. Try another filter.",
// <ErrorState> with retry. Keep the filters in the URL query string if you can.
// Until the API is ready you can use `mockIssuesResponse` from ../mocks/mockData.

export default function IssuesPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">IssuesPage</h1>
    </section>
  );
}

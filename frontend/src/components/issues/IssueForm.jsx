// TODO (Member B, Section 10): the form shared by /report and /issues/:id/edit.
// Fields: title, description, category, Building dropdown (BUILDINGS) + optional room/spot box
// (saved together as "Building, Spot"), photo upload with preview (jpg/png/webp, max 2 MB).
// Show per-field errors from the API (getFieldErrors). Disable the submit button while saving.
// On /report, read ?location= from the URL (for QR codes) and render <DuplicateWarning />.
// Props: initialValues, onSubmit(formData), submitting, submitLabel

export default function IssueForm({ initialValues, onSubmit, submitting, submitLabel }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      IssueForm
    </div>
  );
}

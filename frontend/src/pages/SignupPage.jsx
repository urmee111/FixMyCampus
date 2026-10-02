// TODO (Member B, Section 10): /signup (public).
// Form: name, email, password (min 6), role select (student / admin).
// The "Admin code" field appears ONLY when role = admin (backend returns 403 if the code is wrong).
// Call useAuth().signup(payload); show field errors from getFieldErrors(error) under each input
// (e.g. 409 "An account with this email already exists" under email). Link to /login.

export default function SignupPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">SignupPage</h1>
    </section>
  );
}

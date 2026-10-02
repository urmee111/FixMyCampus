// TODO (Member B, Section 10): /login (public).
// Form with email + password (Input), inline errors, a disabled/loading submit button.
// Call useAuth().login(email, password); on success toast + navigate to `location.state?.from` or /issues.
// On error show getErrorMessage(error) (a 401 here means "Invalid email or password").
// Link to /signup. If the user is already logged in, redirect to /issues.

export default function LoginPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">LoginPage</h1>
    </section>
  );
}

// Guards a group of routes (used in App.jsx as a wrapper route).
//   <ProtectedRoute />                          -> any logged-in user
//   <ProtectedRoute allowedRoles={['admin']} /> -> only these roles
//
// Not logged in  -> /login (we remember where they wanted to go in `state.from`)
// Wrong role     -> /issues (home)
// NOTE: this only hides pages. The real security is the role check in the backend API.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still checking localStorage after a refresh: don't redirect yet
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/issues" replace />;
  }

  return <Outlet />; // render the child route
}

// ROUTES ONLY. Nothing else belongs in this file (Member B is the only one who edits it).

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import IssuesPage from './pages/IssuesPage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';
import EditIssuePage from './pages/EditIssuePage';
import MyReportsPage from './pages/MyReportsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Every page is shown inside Layout (navbar + footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/issues" replace />} />

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/issues/:id/edit" element={<EditIssuePage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

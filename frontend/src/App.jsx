import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Layouts
import { PublicLayout } from './layouts/PublicLayout'
import { AppLayout } from './layouts/AppLayout'
import { AdminLayout } from './layouts/AdminLayout'

// Pages
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Issues } from './pages/issues/Issues'
import { IssueDetails } from './pages/issues/IssueDetails'
import { EditIssue } from './pages/issues/EditIssue'
import { ReportIssue } from './pages/issues/ReportIssue'
import { MyReports } from './pages/student/MyReports'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminLocations } from './pages/admin/AdminLocations'
import { NotFound } from './pages/NotFound'
import { Landing } from './pages/Landing'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* Public Auth Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Student & General Application Routes (Protected) */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/issues" element={<Issues />} />
                <Route path="/issues/:id" element={<IssueDetails />} />
                <Route path="/issues/:id/edit" element={<EditIssue />} />
                <Route path="/report" element={<ReportIssue />} />
                <Route path="/my-reports" element={<MyReports />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/locations" element={<AdminLocations />} />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import Landing from './pages/Landing'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/dashboard/Dashboard'
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import ModulePlayer from './pages/courses/ModulePlayer'
import SimHome from './pages/sim/SimHome'
import SimSession from './pages/sim/SimSession'
import CertificateList from './pages/certificates/CertificateList'
import Profile from './pages/profile/Profile'
import Billing from './pages/billing/Billing'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCourses from './pages/admin/AdminCourses'
import AdminScenarios from './pages/admin/AdminScenarios'
import StudentRegistration from './pages/student/StudentRegistration'
import Referral from './pages/referral/Referral'

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', animation: 'pulse 1.5s infinite' }}>
          <span style={{ color: 'white', fontSize: '20px' }}>🩺</span>
        </div>
        <div style={{ color: '#94A3B8', fontSize: '14px' }}>Loading NursePassport...</div>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading, needsOnboarding } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/signin" replace />
  if (needsOnboarding) return <Navigate to="/onboarding" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading, needsOnboarding } = useAuth()
  if (loading) return <LoadingScreen />
  if (user && !needsOnboarding) return <Navigate to="/dashboard" replace />
  return children
}

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setIsAdmin(false); return }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      setIsAdmin(!!data?.is_admin)
    })
  }, [])

  if (isAdmin === null) return <LoadingScreen />
  if (!isAdmin) return <Navigate to="/admin" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
      <Route path="/courses/:slug" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
      <Route path="/courses/:slug/:moduleId" element={<ProtectedRoute><ModulePlayer /></ProtectedRoute>} />
      <Route path="/simulate" element={<ProtectedRoute><SimHome /></ProtectedRoute>} />
      <Route path="/simulate/:scenarioId" element={<ProtectedRoute><SimSession /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><CertificateList /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
      <Route path="/admin/scenarios" element={<AdminRoute><AdminScenarios /></AdminRoute>} />
      <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
      <Route path="/student-registration" element={<ProtectedRoute><StudentRegistration /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" toastOptions={{
          duration: 4000,
          style: { background: '#0A2540', color: '#fff', borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
          success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
          error: { iconTheme: { primary: '#F43F5E', secondary: '#fff' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  )
}

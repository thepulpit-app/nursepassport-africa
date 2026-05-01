import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'

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

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#00897B] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-xl">🩺</span>
        </div>
        <div className="text-[#64748B] text-sm">Loading NursePassport...</div>
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
          success: { iconTheme: { primary: '#00897B', secondary: '#fff' } },
          error: { iconTheme: { primary: '#C62828', secondary: '#fff' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  )
}

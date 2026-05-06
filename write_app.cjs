const fs = require('fs')

const content = `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

import Landing from './pages/Landing'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Onboarding from './pages/Onboarding'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import ModulePlayer from './pages/courses/ModulePlayer'
import SimHome from './pages/sim/SimHome'
import SimSession from './pages/sim/SimSession'
import CertificateList from './pages/certificates/CertificateList'
import Profile from './pages/profile/Profile'
import Billing from './pages/billing/Billing'
import Privacy from './pages/Privacy'
import VerifyCertificate from './pages/VerifyCertificate'
import Terms from './pages/Terms'
import StudentRegistration from './pages/student/StudentRegistration'
import QuestionBank from './pages/questions/QuestionBank'
import MockExam from './pages/questions/MockExam'
import Analytics from './pages/questions/Analytics'
import OSCEQuestions from './pages/questions/OSCEQuestions'
import Referral from './pages/referral/Referral'

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
      <Route path="/courses/:slug" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
      <Route path="/courses/:slug/:moduleId" element={<ProtectedRoute><ModulePlayer /></ProtectedRoute>} />
      <Route path="/simulate" element={<ProtectedRoute><SimHome /></ProtectedRoute>} />
      <Route path="/simulate/:scenarioId" element={<ProtectedRoute><SimSession /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><CertificateList /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
      <Route path="/verify/:certificateNumber" element={<VerifyCertificate />} />
      <Route path="/questions" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
      <Route path="/mock-exam" element={<ProtectedRoute><MockExam /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/osce" element={<ProtectedRoute><OSCEQuestions /></ProtectedRoute>} />
      <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
      <Route path="/student-registration" element={<StudentRegistration />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}
`

fs.writeFileSync('src/App.jsx', content)
console.log('App.jsx written successfully')

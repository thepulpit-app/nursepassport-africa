import PWAInstallPrompt from './components/PWAInstallPrompt'
import PushNotificationManager from './components/PushNotificationManager'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import Landing from './pages/Landing'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Onboarding from './pages/Onboarding'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard/Dashboard'
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import ModulePlayer from './pages/courses/ModulePlayer'
import Leaderboard from './pages/Leaderboard'
import Community from './pages/Community'
import TryDemo from './pages/TryDemo'
import NCLEXNigeria from './pages/seo/NCLEXNigeria'
import NMCCBTNigeria from './pages/seo/NMCCBTNigeria'
import HAADDubaiNigeria from './pages/seo/HAADDubaiNigeria'
import OSCENigeria from './pages/seo/OSCENigeria'
import CTGTrainingNigeria from './pages/seo/CTGTrainingNigeria'
import WeeklyChallenge from './pages/WeeklyChallenge'
import SimHome from './pages/sim/SimHome'
import SimSession from './pages/sim/SimSession'
import CertificateList from './pages/certificates/CertificateList'
import Profile from './pages/profile/Profile'
import Billing from './pages/billing/Billing'
import Privacy from './pages/Privacy'
import About from './pages/About'
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


const PAGE_TITLES = {
  '/': 'NursePassport Africa - Home',
  '/signup': 'Sign Up - NursePassport Africa',
  '/signin': 'Sign In - NursePassport Africa',
  '/dashboard': 'Dashboard - NursePassport Africa',
  '/courses': 'Courses - NursePassport Africa',
  '/try': 'Free Demo - NursePassport Africa',
  '/leaderboard': 'Leaderboard - NursePassport Africa',
  '/community': 'Community - NursePassport Africa',
  '/weekly-challenge': 'Weekly Challenge - NursePassport Africa',
  '/question-banks': 'Question Banks - NursePassport Africa',
  '/certificates': 'Certificates - NursePassport Africa',
  '/profile': 'Profile - NursePassport Africa',
  '/billing': 'Billing - NursePassport Africa',
  '/about': 'About AMCC - NursePassport Africa',
  '/refer': 'Refer & Earn - NursePassport Africa',
  '/nclex-preparation-nigeria': 'NCLEX-RN Preparation Nigeria - NursePassport Africa',
  '/nmc-cbt-preparation-nigeria': 'NMC CBT Preparation Nigeria - NursePassport Africa',
  '/haad-dha-exam-nigeria': 'HAAD/DHA Exam Preparation Nigeria - NursePassport Africa',
  '/nmc-osce-training-nigeria': 'NMC OSCE Training Nigeria - NursePassport Africa',
  '/ctg-training-nigeria': 'CTG Training Nigeria - NursePassport Africa',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/courses/') && pathname.includes('/module/')) return 'Course Module - NursePassport Africa'
  if (pathname.startsWith('/courses/')) return 'Course - NursePassport Africa'
  if (pathname.startsWith('/simulate/')) return 'ClinicalSim Session - NursePassport Africa'
  if (pathname.startsWith('/admin')) return 'Admin - NursePassport Africa'
  return 'NursePassport Africa'
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
      <Route path="/courses/:slug" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
      <Route path="/courses/:slug/:moduleId" element={<ProtectedRoute><ModulePlayer /></ProtectedRoute>} />
      <Route path="/try" element={<TryDemo />} />
            <Route path="/nclex-preparation-nigeria" element={<NCLEXNigeria />} />
            <Route path="/nmc-cbt-preparation-nigeria" element={<NMCCBTNigeria />} />
            <Route path="/haad-dha-exam-nigeria" element={<HAADDubaiNigeria />} />
            <Route path="/nmc-osce-training-nigeria" element={<OSCENigeria />} />
            <Route path="/ctg-training-nigeria" element={<CTGTrainingNigeria />} />
            <Route path="/community" element={<Community />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/challenge" element={<WeeklyChallenge />} />
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
      <Route path="/about" element={<About />} />
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
          <PWAInstallPrompt />
          <PushNotificationManager />
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

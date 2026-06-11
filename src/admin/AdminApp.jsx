import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext({})
const useAdmin = () => useContext(AdminContext)

import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminCourses from './pages/AdminCourses'
import AdminSettings from './pages/AdminSettings'
import AdminScenarios from './pages/AdminScenarios'
import AdminNuggets from './pages/AdminNuggets'
import AdminCommunity from './pages/AdminCommunity'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminQuizQuestions from './pages/AdminQuizQuestions'
import AdminCertificates from './pages/AdminCertificates'

const PAGES = {
  dashboard: AdminDashboard,
  scenarios: AdminScenarios,
  nuggets: AdminNuggets,
  community: AdminCommunity,
  analytics: AdminAnalytics,
  users: AdminUsers,
  courses: AdminCourses,
  certificates: AdminCertificates,
  'quiz-questions': AdminQuizQuestions,
  settings: AdminSettings,
}

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'users', label: 'Users', icon: '👥' },
  { key: 'courses', label: 'Courses', icon: '📚' },
  { key: 'certificates', label: 'Certificates', icon: '🏆' },
  { key: 'quiz-questions', label: 'Quiz Questions', icon: '❓' },
  { key: 'scenarios', label: 'ClinicalSim', icon: '🩺' },
  { key: 'analytics', label: 'Analytics', icon: '📈' },
  { key: 'nuggets', label: 'Daily Nuggets', icon: '📚' },
    { key: 'community', label: 'Community', icon: '💬' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminApp() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (data?.is_admin) setAdmin(data)
      setLoading(false)
    })
  }, [])

  async function handleLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return error.message
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
    if (!profile?.is_admin) {
      await supabase.auth.signOut()
      return 'Access denied — admin only'
    }
    setAdmin(profile)
    return null
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setAdmin(null)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A2540', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '16px' }}>Loading...</div>
    </div>
  )

  if (!admin) return <AdminLogin onLogin={handleLogin} />

  const PageComponent = PAGES[page] || AdminDashboard

  function navigate(key) {
    setPage(key)
    setSidebarOpen(false)
  }

  return (
    <AdminContext.Provider value={{ admin, page, setPage: navigate, handleSignOut }}>
      <style>{`
        .admin-sidebar { width: 220px; background: linear-gradient(180deg, #0A2540, #1E3A5F); min-height: 100vh; position: fixed; left: 0; top: 0; display: flex; flex-direction: column; z-index: 50; transition: transform 0.3s ease; }
        .admin-main { flex: 1; margin-left: 220px; background: #F7F9FC; min-height: 100vh; padding: 32px 40px; }
        .admin-topbar { display: none; }
        .admin-overlay { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); width: 260px; }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0; padding: 16px; padding-top: 64px; padding-bottom: 80px; }
          .admin-topbar { display: flex; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0A2540; z-index: 40; align-items: center; padding: 0 16px; gap: 12px; }
          .admin-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 45; }
          .admin-bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #0A2540; border-top: 1px solid rgba(255,255,255,0.1); z-index: 40; padding: 8px 0 4px; }
        }
        @media (min-width: 769px) {
          .admin-bottom-nav { display: none; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

        {/* Mobile overlay */}
        {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Mobile topbar */}
        <div className="admin-topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[0,1,2].map(i => <div key={i} style={{ height: '2px', background: 'white', borderRadius: '2px' }} />)}
            </div>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '14px' }}>NursePassport Admin</div>
            <div style={{ color: '#F59E0B', fontSize: '10px', fontWeight: '700' }}>{NAV.find(n => n.key === page)?.label}</div>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px' }}>
            {admin?.full_name?.[0] || 'A'}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '14px' }}>NursePassport</div>
            <div style={{ color: '#F59E0B', fontWeight: '700', fontSize: '11px', marginTop: '2px' }}>Admin Portal</div>
          </div>
          <div style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', padding: '4px 8px' }}>{admin?.full_name}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '0 8px' }}>{admin?.email}</div>
          </div>
          <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
            {NAV.map(item => (
              <button key={item.key} onClick={() => navigate(item.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', background: page === item.key ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', cursor: 'pointer', color: page === item.key ? 'white' : 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600', textAlign: 'left' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => window.location.href = '/'}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
              ← Back to App
            </button>
            <button onClick={handleSignOut}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '600' }}>
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <PageComponent />
        </main>

        {/* Mobile bottom nav — quick access to most used pages */}
        <div className="admin-bottom-nav">
          {[
            { key: 'dashboard', icon: '📊', label: 'Home' },
            { key: 'users', icon: '👥', label: 'Users' },
            { key: 'scenarios', icon: '🩺', label: 'Sims' },
            { key: 'nuggets', icon: '📚', label: 'Nuggets' },
            { key: 'analytics', icon: '📈', label: 'Stats' },
          ].map(item => (
            <button key={item.key} onClick={() => navigate(item.key)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: '700', color: page === item.key ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>{item.label}</span>
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>☰</span>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>More</span>
          </button>
        </div>
      </div>
    </AdminContext.Provider>
  )
}

import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

// Admin Context
const AdminContext = createContext({})
const useAdmin = () => useContext(AdminContext)

// Pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminCourses from './pages/AdminCourses'
import AdminSettings from './pages/AdminSettings'
import AdminQuizQuestions from './pages/AdminQuizQuestions'
import AdminCertificates from './pages/AdminCertificates'

const PAGES = {
  dashboard: AdminDashboard,
  users: AdminUsers,
  courses: AdminCourses,
  certificates: AdminCertificates,
  'quiz-questions': AdminQuizQuestions,
  settings: AdminSettings,
}

export default function AdminApp() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('dashboard')

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

  return (
    <AdminContext.Provider value={{ admin, page, setPage, handleSignOut }}>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <AdminSidebar />
        <main style={{ flex: 1, marginLeft: '220px', background: '#F7F9FC', minHeight: '100vh', padding: '32px 40px' }}>
          <PageComponent />
        </main>
      </div>
    </AdminContext.Provider>
  )
}

function AdminSidebar() {
  const { admin, page, setPage, handleSignOut } = useAdmin()
  const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'courses', label: 'Courses', icon: '📚' },
    { key: 'certificates', label: 'Certificates', icon: '🏆' },
    { key: 'quiz-questions', label: 'Quiz Questions', icon: '❓' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside style={{ width: '220px', background: 'linear-gradient(180deg, #0A2540, #1E3A5F)', minHeight: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', zIndex: 40 }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'white', fontWeight: '800', fontSize: '14px' }}>NursePassport</div>
        <div style={{ color: '#F59E0B', fontWeight: '700', fontSize: '11px', marginTop: '2px' }}>Admin Portal</div>
      </div>
      <div style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', padding: '4px 8px' }}>{admin?.full_name}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '0 8px' }}>{admin?.email}</div>
      </div>
      <nav style={{ flex: 1, padding: '10px 8px' }}>
        {NAV.map(item => (
          <button key={item.key} onClick={() => setPage(item.key)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', background: page === item.key ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', cursor: 'pointer', color: page === item.key ? 'white' : 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600', textAlign: 'left' }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={handleSignOut}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '600' }}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  )
}

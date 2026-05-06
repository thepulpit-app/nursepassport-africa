import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCourses from './pages/admin/AdminCourses'
import AdminScenarios from './pages/admin/AdminScenarios'
import AdminCertificates from './pages/admin/AdminCertificates'
import AdminQuizQuestions from './pages/admin/AdminQuizQuestions'
import AdminSettings from './pages/admin/AdminSettings'

function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A2540', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '16px' }}>Loading...</div>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      setSession(session)
      setIsAdmin(!!data?.is_admin)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) { setSession(null); setIsAdmin(false); return }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      setSession(session)
      setIsAdmin(!!data?.is_admin)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <Loading />
  if (!session || !isAdmin) return <AdminLogin onLogin={(s) => { setSession(s); setIsAdmin(true) }} />

  const PAGES = {
    dashboard: <AdminDashboard navigate={setPage} />,
    users: <AdminUsers navigate={setPage} />,
    courses: <AdminCourses navigate={setPage} />,
    scenarios: <AdminScenarios navigate={setPage} />,
    certificates: <AdminCertificates navigate={setPage} />,
    'quiz-questions': <AdminQuizQuestions navigate={setPage} />,
    settings: <AdminSettings navigate={setPage} />,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: 'linear-gradient(180deg, #0A2540, #1E3A5F)', minHeight: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>NursePassport</div>
          <div style={{ color: '#F59E0B', fontSize: '11px', fontWeight: '700' }}>Admin Portal</div>
        </div>

        <nav style={{ flex: 1, padding: '10px 8px' }}>
          {[
            { key: 'dashboard', label: '📊 Dashboard' },
            { key: 'users', label: '👥 Users' },
            { key: 'courses', label: '📚 Courses' },
            { key: 'scenarios', label: '🩺 Sim Scenarios' },
            { key: 'certificates', label: '🏆 Certificates' },
            { key: 'quiz-questions', label: '❓ Quiz Questions' },
            { key: 'settings', label: '⚙️ Settings' },
          ].map(item => (
            <button key={item.key} onClick={() => setPage(item.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'left', transition: 'all 0.2s',
                background: page === item.key ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: page === item.key ? 'white' : 'rgba(255,255,255,0.65)' }}>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => { supabase.auth.signOut(); window.location.href = '/' }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: 'transparent', color: 'rgba(255,255,255,0.45)', textAlign: 'left' }}>
            ← Back to App
          </button>
          <button onClick={() => supabase.auth.signOut()}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: 'transparent', color: 'rgba(255,255,255,0.45)', textAlign: 'left' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', background: '#F8FAFC', minHeight: '100vh' }}>
        {PAGES[page] || PAGES.dashboard}
      </main>
    </div>
  )
}

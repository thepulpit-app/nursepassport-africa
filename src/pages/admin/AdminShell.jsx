import { useNavigate, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, Activity, Award, LogOut, Stethoscope, FileText, Settings } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/scenarios', icon: Activity, label: 'Sim Scenarios' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
]

export default function AdminShell({ children }) {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: 'linear-gradient(180deg, #0A2540, #1E3A5F)', minHeight: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#F59E0B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={16} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '13px', lineHeight: 1 }}>NursePassport</div>
              <div style={{ color: '#F59E0B', fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>ADMIN</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              })}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleSignOut}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '220px', flex: 1, background: '#F7F9FC', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

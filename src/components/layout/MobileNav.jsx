import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Activity, Award, ClipboardList, Gift, User, CreditCard, Info, X, Menu, Shield, Trophy, Zap, MessageCircle } from 'lucide-react'

const MAIN_NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { to: '/courses',      icon: BookOpen,         label: 'Courses' },
  { to: '/simulate',     icon: Activity,         label: 'Simulate' },
  { to: '/certificates', icon: Award,            label: 'Certs' },
]

const MORE_NAV = [
  { to: '/community', icon: MessageCircle, label: 'Community' },
  { to: '/questions',   icon: ClipboardList, label: 'Question Banks' },
  { to: '/referral',    icon: Gift,          label: 'Refer & Earn' },
  { to: '/about',       icon: Info,          label: 'About AMCC' },
  { to: '/profile',     icon: User,          label: 'Profile' },
  { to: '/billing',     icon: CreditCard,    label: 'Billing' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { isDark, toggleDarkMode } = require('../../contexts/ThemeContext').useTheme ? require('../../contexts/ThemeContext').useTheme() : { isDark: false, toggleDarkMode: () => {} }

  function goTo(path) {
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {MAIN_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600'
                }`
              }>
              <Icon size={20} />
              <span className="text-xs font-semibold">{label}</span>
            </NavLink>
          ))}
          <button onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-400 hover:text-gray-600 transition-all">
            <Menu size={20} />
            <span className="text-xs font-semibold">More</span>
          </button>
        </div>
      </nav>

      {/* More Sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '24px 24px 0 0', padding: '16px 16px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '800', fontSize: '16px', color: '#0A2540' }}>More</span>
              <button onClick={() => setOpen(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} color="#64748B" />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {MORE_NAV.map(({ to, icon: Icon, label }) => (
                <button key={to} onClick={() => goTo(to)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '14px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="#4F46E5" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>{label}</span>
                </button>
              ))}
              <button onClick={() => goTo('/leaderboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '14px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trophy size={18} color="#F59E0B" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>Leaderboard</span>
              </button>
              <button onClick={() => goTo('/challenge')}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '14px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={18} color="#F43F5E" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>Challenge</span>
              </button>
              {profile?.is_admin && (
                <button onClick={() => { setOpen(false); window.location.href = '/admin' }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F0FDF4', borderRadius: '14px', border: '1.5px solid #BBF7D0', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} color="#22C55E" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>Admin Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

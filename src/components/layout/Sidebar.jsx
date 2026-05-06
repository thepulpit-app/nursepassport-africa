import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Activity, Award, User, CreditCard, LogOut, ClipboardList, Gift, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses',      icon: BookOpen,         label: 'Courses' },
  { to: '/simulate',     icon: Activity,         label: 'ClinicalSim AI' },
  { to: '/certificates', icon: Award,            label: 'Certificates' },
  { to: '/questions',    icon: ClipboardList,    label: 'Question Banks' },
  { to: '/referral',     icon: Gift,             label: 'Refer & Earn' },
]

const BOTTOM_NAV = [
  { to: '/profile', icon: User,       label: 'Profile' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
]

const DEFAULT_THEME = { secondary: "#00897B", gradient: "linear-gradient(135deg, #0A2540, #1E3A5F)" }

export default function Sidebar() {
  const { profile, tier, isFoundingMember, signOut } = useAuth()
  const { theme: rawTheme } = useTheme()
  const theme = rawTheme || DEFAULT_THEME
  const navigate = useNavigate()

  const TIER_BADGE = {
    free:     { label: 'Free',     bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' },
    student:  { label: 'Student',  bg: '#4F46E5', color: 'white' },
    nurse:    { label: 'Nurse',    bg: theme.secondary, color: 'white' },
    passport: { label: 'Passport', bg: '#F4A300', color: '#0A2540' },
  }
  const badge = TIER_BADGE[tier] || TIER_BADGE.free

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const navStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
    borderRadius: '12px', marginBottom: '4px', textDecoration: 'none',
    fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
  })

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-30"
      style={{ background: theme.gradient }}>

      {/* Logo */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '13px', lineHeight: 1 }}>NursePassport</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '2px' }}>Africa</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: theme.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>
            {profile?.full_name?.[0]?.toUpperCase() || 'N'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.full_name || 'Nurse'}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
              {isFoundingMember && (
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: 'rgba(244,163,0,0.2)', color: '#F4A300' }}>
                  ⭐ Founding
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => navStyle(isActive)}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => navStyle(isActive)}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {/* Admin link — only for admins */}
        {profile?.is_admin && (
  <button onClick={() => { window.location.href = '/admin/dashboard' }}
    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,163,0,0.8)', fontSize: '13px', fontWeight: '600' }}>
    <Settings size={17} />
    Admin Portal
  </button>
)}

        <button onClick={handleSignOut}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '600' }}>
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

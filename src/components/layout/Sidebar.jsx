import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Activity, Award, User, CreditCard, LogOut, Stethoscope } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses',      icon: BookOpen,         label: 'Courses' },
  { to: '/simulate',     icon: Activity,         label: 'ClinicalSim AI' },
  { to: '/certificates', icon: Award,            label: 'Certificates' },
]

const BOTTOM_NAV = [
  { to: '/profile', icon: User,       label: 'Profile' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
]

export default function Sidebar() {
  const { profile, tier, isFoundingMember, signOut } = useAuth()
  const navigate = useNavigate()

  const TIER_BADGE = {
    free:     { label: 'Free',     bg: 'bg-gray-100 text-gray-600' },
    nurse:    { label: 'Nurse',    bg: 'bg-[#0A2540] text-white' },
    passport: { label: 'Passport', bg: 'bg-[#F4A300] text-[#0A2540]' },
  }

  const badge = TIER_BADGE[tier] || TIER_BADGE.free

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0A2540] min-h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#00897B] rounded-xl flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              NursePassport
            </div>
            <div className="text-white/50 text-xs">Africa</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00897B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {profile?.full_name?.[0]?.toUpperCase() || 'N'}
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{profile?.full_name || 'Nurse'}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg}`}>
                {badge.label}
              </span>
              {isFoundingMember && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4A300]/20 text-[#F4A300] font-medium">
                  Founding
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
               ${isActive
                 ? 'bg-[#00897B] text-white shadow-lg shadow-[#00897B]/30'
                 : 'text-white/70 hover:text-white hover:bg-white/10'
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
        {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
               ${isActive
                 ? 'bg-white/10 text-white'
                 : 'text-white/60 hover:text-white hover:bg-white/10'
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

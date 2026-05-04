import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Activity, Award, User } from 'lucide-react'

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { to: '/courses',      icon: BookOpen,         label: 'Courses' },
  { to: '/simulate',     icon: Activity,         label: 'Simulate' },
  { to: '/certificates', icon: Award,            label: 'Certs' },
  { to: '/profile',      icon: User,             label: 'Profile' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

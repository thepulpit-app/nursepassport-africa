const fs = require('fs')
let c = fs.readFileSync('src/components/layout/MobileNav.jsx', 'utf8')

// Add useAuth import
c = c.replace(
  "import { useState } from 'react'",
  "import { useState } from 'react'\nimport { useAuth } from '../../contexts/AuthContext'"
)

// Add Shield icon import
c = c.replace(
  "import { LayoutDashboard, BookOpen, Activity, Award, ClipboardList, Gift, User, CreditCard, Info, X, Menu } from 'lucide-react'",
  "import { LayoutDashboard, BookOpen, Activity, Award, ClipboardList, Gift, User, CreditCard, Info, X, Menu, Shield, Trophy, Zap } from 'lucide-react'"
)

// Add useAuth to component
c = c.replace(
  "export default function MobileNav() {\n  const [open, setOpen] = useState(false)\n  const navigate = useNavigate()",
  "export default function MobileNav() {\n  const [open, setOpen] = useState(false)\n  const navigate = useNavigate()\n  const { profile } = useAuth()"
)

// Add admin, leaderboard, challenge to MORE_NAV grid
c = c.replace(
  `              {MORE_NAV.map(({ to, icon: Icon, label }) => (
                <button key={to} onClick={() => goTo(to)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '14px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="#4F46E5" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>{label}</span>
                </button>
              ))}`,
  `              {MORE_NAV.map(({ to, icon: Icon, label }) => (
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
              )}`
)

fs.writeFileSync('src/components/layout/MobileNav.jsx', c)
console.log('Done')

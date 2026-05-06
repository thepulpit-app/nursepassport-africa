import { useEffect, useState } from 'react'
import { Users, BookOpen, Activity, Award, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminShell from './AdminShell'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, paid: 0, simSessions: 0, certificates: 0, freeUsers: 0, nurseUsers: 0, passportUsers: 0 })
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    const [usersRes, simRes, certRes, recentRes] = await Promise.all([
      supabase.from('profiles').select('subscription_tier, created_at'),
      supabase.from('sim_sessions').select('id', { count: 'exact' }),
      supabase.from('certificates').select('id', { count: 'exact' }),
      supabase.from('profiles').select('full_name, email, subscription_tier, career_goal, created_at').order('created_at', { ascending: false }).limit(10),
    ])
    const users = usersRes.data || []
    setStats({
      users: users.length,
      paid: users.filter(u => u.subscription_tier !== 'free').length,
      freeUsers: users.filter(u => u.subscription_tier === 'free').length,
      nurseUsers: users.filter(u => u.subscription_tier === 'nurse').length,
      passportUsers: users.filter(u => u.subscription_tier === 'passport').length,
      simSessions: simRes.count || 0,
      certificates: certRes.count || 0,
    })
    setRecentUsers(recentRes.data || [])
    setLoading(false)
  }

  const STAT_CARDS = [
    { icon: Users, label: 'Total Nurses', value: stats.users, bg: '#EEF2FF', ic: '#6366F1', sub: `${stats.paid} paid` },
    { icon: TrendingUp, label: 'Paid Subscribers', value: stats.paid, bg: '#F0FDF4', ic: '#22C55E', sub: `${stats.users > 0 ? Math.round((stats.paid / stats.users) * 100) : 0}% conversion` },
    { icon: Activity, label: 'Sim Sessions', value: stats.simSessions, bg: '#FFF1F2', ic: '#F43F5E', sub: 'Total all time' },
    { icon: Award, label: 'Certificates', value: stats.certificates, bg: '#FFFBEB', ic: '#F59E0B', sub: 'Issued' },
  ]

  const TIER_COLORS = { free: { bg: '#F8FAFC', color: '#64748B' }, nurse: { bg: '#EEF2FF', color: '#4F46E5' }, passport: { bg: '#FFF7ED', color: '#F59E0B' } }

  return (
    <AdminShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Admin Dashboard</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>NursePassport Africa — Overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {STAT_CARDS.map(({ icon: Icon, label, value, bg, ic, sub }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
            <div style={{ width: '40px', height: '40px', background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Icon size={18} color={ic} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0A2540', lineHeight: 1, marginBottom: '2px' }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Plan Breakdown</h2>
          {[
            { label: 'Grace (Free)', value: stats.freeUsers, tier: 'free' },
            { label: 'Nurse', value: stats.nurseUsers, tier: 'nurse' },
            { label: 'Passport', value: stats.passportUsers, tier: 'passport' },
          ].map(item => {
            const t = TIER_COLORS[item.tier]
            const pct = stats.users > 0 ? Math.round((item.value / stats.users) * 100) : 0
            return (
              <div key={item.tier} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: t.color }}>{item.value}</span>
                </div>
                <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ background: t.color, height: '100%', width: `${pct}%`, borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent users */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Recent Signups</h2>
          <div>
            {recentUsers.map((user, i) => {
              const t = TIER_COLORS[user.subscription_tier] || TIER_COLORS.free
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < recentUsers.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                    {user.full_name?.[0]?.toUpperCase() || 'N'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name || 'Unknown'}</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {user.career_goal && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: '#F8FAFC', color: '#64748B', fontWeight: '600' }}>{user.career_goal}</span>}
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: t.bg, color: t.color, fontWeight: '700' }}>{user.subscription_tier}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

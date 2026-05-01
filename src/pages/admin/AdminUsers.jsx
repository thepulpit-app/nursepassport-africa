import { useEffect, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminShell from './AdminShell'
import toast from 'react-hot-toast'

const TIERS = ['free', 'nurse', 'passport']
const TIER_COLORS = { free: { bg: '#F8FAFC', color: '#64748B' }, nurse: { bg: '#EEF2FF', color: '#4F46E5' }, passport: { bg: '#FFF7ED', color: '#F59E0B' } }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  async function updateTier(userId, newTier) {
    setUpdatingId(userId)
    await supabase.from('profiles').update({ subscription_tier: newTier }).eq('id', userId)
    setUsers(u => u.map(user => user.id === userId ? { ...user, subscription_tier: newTier } : user))
    toast.success('Plan updated')
    setUpdatingId(null)
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.career_goal?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Users</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>{users.length} nurses registered</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or goal..."
          style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              {['Nurse', 'Email', 'Goal', 'Plan', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No users found</td></tr>
            ) : filtered.map((user, i) => {
              const t = TIER_COLORS[user.subscription_tier] || TIER_COLORS.free
              return (
                <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>
                        {user.full_name?.[0]?.toUpperCase() || 'N'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{user.full_name || 'Unknown'}</div>
                        {user.is_founding_member && <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: '700' }}>⭐ Founding</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B' }}>{user.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {user.career_goal && <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: '#F8FAFC', color: '#64748B', fontWeight: '600' }}>{user.career_goal}</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: t.bg, color: t.color, fontWeight: '700' }}>
                      {user.subscription_tier}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8' }}>
                    {new Date(user.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select value={user.subscription_tier} disabled={updatingId === user.id}
                      onChange={e => updateTier(user.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', cursor: 'pointer', background: 'white', color: '#0A2540', fontWeight: '600' }}>
                      {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

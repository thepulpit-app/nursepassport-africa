import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'
import ThemeSelector from '../../components/ui/ThemeSelector'

const QUALIFICATIONS = ['RN', 'RM', 'RN/RM', 'Nursing Student', 'Healthcare Assistant']
const GOALS = [
  { value: 'UK', flag: '🇬🇧', label: 'United Kingdom', sub: 'NMC registration' },
  { value: 'UAE', flag: '🇦🇪', label: 'UAE', sub: 'HAAD/DHA exam' },
  { value: 'USA', flag: '🇺🇸', label: 'USA', sub: 'NCLEX-RN' },
  { value: 'Canada', flag: '🇨🇦', label: 'Canada', sub: 'NCLEX-RN + provincial' },
  { value: 'Nigeria', flag: '🇳🇬', label: 'Nigeria', sub: 'Local practice' },
]

const TIER_INFO = {
  free:     { label: 'Grace — Free', bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' },
  nurse:    { label: 'Nurse Plan', bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE' },
  passport: { label: 'Passport Plan', bg: '#FFF7ED', color: '#F59E0B', border: '#FDE68A' },
}

export default function Profile() {
  const { profile, updateProfile, user, tier, isFoundingMember, signOut } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    qualification: profile?.qualification || '',
    career_goal: profile?.career_goal || '',
  })
  const [loading, setLoading] = useState(false)
  const t = TIER_INFO[tier] || TIER_INFO.free

  async function handleSave() {
    setLoading(true)
    const { error } = await updateProfile(form)
    setLoading(false)
    if (error) return toast.error('Failed to save')
    toast.success('Profile updated!')
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <AppShell>
      <style>{`
        .profile-section { background: white; border-radius: 20px; border: 1px solid #F1F5F9; padding: 20px; margin-bottom: 16px; }
        .profile-input { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #E2E8F0; font-size: 14px; color: #0A2540; outline: none; box-sizing: border-box; transition: border-color 0.2s; background: white; }
        .profile-input:focus { border-color: #6366F1; }
        .qual-btn { padding: 9px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1.5px solid #E2E8F0; background: white; color: #64748B; }
        .qual-btn.active { border-color: #6366F1; background: #EEF2FF; color: #4F46E5; }
        .goal-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #E2E8F0; background: white; cursor: pointer; transition: all 0.2s; text-align: left; }
        .goal-btn.active { border-color: #6366F1; background: #EEF2FF; }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>My Profile</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Manage your account</p>
      </div>

      {/* Profile header card */}
      <div className="profile-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '20px', flexShrink: 0 }}>
          {profile?.full_name?.[0]?.toUpperCase() || 'N'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.full_name}</div>
          <div style={{ color: '#94A3B8', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
              {t.label}
            </span>
            {isFoundingMember && (
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: '#FFF7ED', color: '#F59E0B', border: '1px solid #FDE68A' }}>
                ⭐ Founding Member
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="profile-section">
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Personal Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
            <input className="profile-input" type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</label>
            <input className="profile-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234..." />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qualification</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUALIFICATIONS.map(q => (
              <button key={q} className={`qual-btn ${form.qualification === q ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, qualification: q }))}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Goal</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {GOALS.map(g => (
              <button key={g.value} className={`goal-btn ${form.career_goal === g.value ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, career_goal: g.value }))}>
                <span style={{ fontSize: '22px' }}>{g.flag}</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{g.label}</div>
                  <div style={{ color: '#94A3B8', fontSize: '12px' }}>{g.sub}</div>
                </div>
                {form.career_goal === g.value && <div style={{ marginLeft: 'auto', width: '20px', height: '20px', background: '#6366F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'white', fontSize: '12px' }}>✓</span></div>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

{/* Theme */}
<div className="profile-section">
  <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Appearance</h2>
  <ThemeSelector />
</div>
      {/* Account actions */}
      <div className="profile-section">
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 12px' }}>Account</h2>
        {[
          { label: 'Manage Subscription', sub: `${t.label} · Upgrade or change plan`, action: () => navigate('/billing'), color: '#4F46E5' },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', cursor: 'pointer', marginBottom: '8px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{item.label}</div>
              <div style={{ color: '#94A3B8', fontSize: '12px' }}>{item.sub}</div>
            </div>
            <ChevronRight size={16} color="#CBD5E1" />
          </button>
        ))}
        <button onClick={handleSignOut}
          style={{ width: '100%', padding: '14px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '12px', color: '#F43F5E', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </AppShell>
  )
}

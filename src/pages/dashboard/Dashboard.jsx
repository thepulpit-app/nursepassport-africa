import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Activity, Award, TrendingUp, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import AppShell from '../../components/layout/AppShell'

export default function Dashboard() {
  const { profile, tier, isFoundingMember } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ coursesStarted: 0, modulesCompleted: 0, simSessions: 0, certificates: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile) loadStats() }, [profile])

  async function loadStats() {
    const [progressRes, simRes, certRes] = await Promise.all([
      supabase.from('user_progress').select('course_id, status').eq('user_id', profile.id),
      supabase.from('sim_sessions').select('id').eq('user_id', profile.id),
      supabase.from('certificates').select('id').eq('user_id', profile.id),
    ])
    const progress = progressRes.data || []
    setStats({
      coursesStarted: [...new Set(progress.map(p => p.course_id))].length,
      modulesCompleted: progress.filter(p => p.status === 'completed').length,
      simSessions: simRes.data?.length || 0,
      certificates: certRes.data?.length || 0,
    })
    setLoading(false)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'Nurse'
  const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }
  const used = profile?.sim_sessions_used || 0
  const limit = tier === 'passport' ? Infinity : tier === 'nurse' ? 20 : 3
  const remaining = limit === Infinity ? '∞' : Math.max(0, limit - used)

  return (
    <AppShell noPadding>
      <style>{`
        .db-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
        .db-main { display: flex; flex-direction: column; gap: 16px; }
        .db-row { display: flex; flex-direction: column; gap: 16px; }
        .stat-card { background: white; border-radius: 16px; padding: 16px 14px; border: 1px solid #EEF2FF; cursor: pointer; }
        .stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .stat-value { font-size: 26px; font-weight: 800; color: #0A2540; line-height: 1; }
        .stat-label { font-size: 11px; color: #94A3B8; font-weight: 600; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.04em; }
        .hero-card { border-radius: 20px; padding: 22px; color: white; }
        .hero-card h3 { color: white; font-size: 17px; font-weight: 800; margin: 0 0 4px; line-height: 1.3; }
        .hero-card p { color: rgba(255,255,255,0.75); font-size: 12px; margin: 0; }
        .pbar-bg { background: rgba(255,255,255,0.25); border-radius: 99px; height: 5px; overflow: hidden; margin: 14px 0; }
        .pbar-fill { background: white; height: 100%; border-radius: 99px; }
        .white-btn { background: white; border: none; border-radius: 12px; padding: 11px 20px; font-weight: 700; font-size: 13px; cursor: pointer; width: 100%; }
        .info-card { background: white; border-radius: 16px; padding: 18px; border: 1px solid #F1F5F9; }
        .info-card h4 { font-size: 13px; font-weight: 700; color: #0A2540; margin: 0 0 12px; }
        .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
        @media (min-width: 768px) {
          .db-stats { grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .db-row { flex-direction: row; }
          .db-row > * { flex: 1; }
        }
      `}</style>

      {/* Mesh gradient hero header */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 20px 36px', marginBottom: '-16px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 30%, #4F46E5 65%, #F43F5E 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 50%, rgba(244,163,0,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(79,70,229,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 90%, rgba(244,63,94,0.3) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', lineHeight: '1.2', margin: '0 0 4px' }}>
                {greeting}, {firstName}! {GOAL_FLAGS[profile?.career_goal] || '✨'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: 0 }}>
                {tier === 'free' ? 'Grace Plan' : tier === 'student' ? 'Student Nurse' : tier === 'nurse' ? 'Nurse Plan' : tier === 'passport' ? 'Passport Plan' : 'NursePassport'}{profile?.career_goal ? ` · ${profile.career_goal} Track` : ''}
              </p>
            </div>
            {isFoundingMember && (
              <div style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center', flexShrink: 0, minWidth: '64px' }}>
                <div style={{ fontSize: '18px', lineHeight: 1 }}>⭐</div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'white', marginTop: '2px', lineHeight: '1.2' }}>Founding<br />Member</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '20px', background: '#F7F9FC', borderRadius: '20px 20px 0 0', minHeight: 'calc(100vh - 120px)' }}>

        {/* Upgrade banner */}
        {tier === 'free' && (
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', borderRadius: '16px', padding: '16px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={16} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>Unlock full access</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>All courses · AI simulation · Certificates</div>
              </div>
            </div>
            <button onClick={() => navigate('/billing')}
              style={{ background: 'white', color: '#7C3AED', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
              Upgrade
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="db-stats">
          {[
            { icon: BookOpen, label: 'Courses', value: stats.coursesStarted, bg: '#EEF2FF', ic: '#6366F1', path: '/courses' },
            { icon: TrendingUp, label: 'Modules Done', value: stats.modulesCompleted, bg: '#F0FDF4', ic: '#22C55E', path: '/courses' },
            { icon: Activity, label: 'Simulations', value: stats.simSessions, bg: '#FFF1F2', ic: '#F43F5E', path: '/simulate' },
            { icon: Award, label: 'Certificates', value: stats.certificates, bg: '#FFFBEB', ic: '#F59E0B', path: '/certificates' },
          ].map(({ icon: Icon, label, value, bg, ic, path }) => (
            <div key={label} className="stat-card" onClick={() => navigate(path)}>
              <div className="stat-icon" style={{ background: bg }}>
                <Icon size={17} color={ic} />
              </div>
              <div className="stat-value">{loading ? '—' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Courses Coming Soon */}
        <div className="hero-card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)', marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>📚 Clinical Courses</div>
          <h3>Courses Launching Soon</h3>
          <p>CTG Interpretation · Obstetric Emergencies · BLS · NMC OSCE — all coming very soon.</p>
          <div className="pbar-bg"><div className="pbar-fill" style={{ width: '15%' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Content being prepared by our Clinical Director</span>
            <button className="white-btn" style={{ width: 'auto', color: '#7C3AED', padding: '9px 18px' }}
              onClick={() => navigate('/courses')}>
              Browse →
            </button>
          </div>
        </div>

        {/* ClinicalSim + Sessions row */}
        <div className="db-row" style={{ marginBottom: '16px' }}>
          <div className="hero-card" style={{ background: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 60%, #DB2777 100%)' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🩺</div>
            <h3 style={{ fontSize: '16px' }}>ClinicalSim AI</h3>
            <p style={{ marginBottom: '12px' }}>Practice real patient scenarios. Get instant expert clinical feedback.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                {tier === 'passport' ? 'Unlimited sessions' : `${remaining} sessions remaining`}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>{tier.toUpperCase()}</span>
            </div>
            <button className="white-btn" style={{ color: '#F43F5E' }} onClick={() => navigate('/simulate')}>
              Start a Simulation →
            </button>
          </div>

          <div className="info-card">
            <h4>Sim Sessions This Month</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#0A2540', lineHeight: 1 }}>{used}</span>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>/ {limit === Infinity ? '∞' : limit}</span>
            </div>
            <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ background: 'linear-gradient(90deg, #F43F5E, #EC4899)', height: '100%', borderRadius: '99px', width: limit === Infinity ? '30%' : `${Math.min(100, (used / limit) * 100)}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              {tier === 'passport' ? 'Unlimited — Passport plan' : tier === 'nurse' ? `${remaining} remaining this month` : `${remaining} free sessions left`}
            </div>
            {tier !== 'passport' && (
              <button onClick={() => navigate('/billing')}
                style={{ marginTop: '12px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '9px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', width: '100%' }}>
                Get more sessions →
              </button>
            )}
          </div>
        </div>

        {/* Goal + Quick links row */}
        <div className="db-row">
          {profile?.career_goal && (
            <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Your Career Goal</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '40px', lineHeight: 1 }}>{GOAL_FLAGS[profile.career_goal]}</div>
                <div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '22px', lineHeight: 1 }}>{profile.career_goal}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>Target destination</div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { emoji: '📚', label: 'Browse Courses', sub: '4 available', path: '/courses', bg: '#EEF2FF', border: '#C7D2FE', color: '#4F46E5' },
              { emoji: '🎓', label: 'My Certificates', sub: `${stats.certificates} earned`, path: '/certificates', bg: '#FFFBEB', border: '#FDE68A', color: '#D97706' },
            ].map(item => (
              <div key={item.label} onClick={() => navigate(item.path)}
                style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{ fontSize: '22px' }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{item.label}</div>
                  <div style={{ color: '#94A3B8', fontSize: '11px' }}>{item.sub}</div>
                </div>
                <div style={{ color: item.color, fontWeight: '700', fontSize: '16px' }}>›</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

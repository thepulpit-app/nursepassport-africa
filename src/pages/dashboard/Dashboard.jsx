import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Activity, Award, TrendingUp, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import AppShell from '../../components/layout/AppShell'
import StreakBadge from '../../components/StreakBadge'
import ExamCountdown from '../../components/ExamCountdown'
import MilestoneBadges from '../../components/MilestoneBadges'
import { useStreak } from '../../hooks/useStreak'

export default function Dashboard() {
  const { profile, tier, isFoundingMember, user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ coursesStarted: 0, modulesCompleted: 0, simSessions: 0, certificates: 0 })
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)

  useStreak(user)

  useEffect(() => { if (profile) { loadStats(); loadProfile() } }, [profile])

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

  async function loadProfile() {
    const { data } = await supabase.from('profiles')
      .select('current_streak, longest_streak, exam_type, exam_date, career_goal')
      .eq('id', profile.id).single()
    setProfileData(data)
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
        .db-row { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
        .stat-card { background: white; border-radius: 16px; padding: 16px 14px; border: 1px solid #EEF2FF; cursor: pointer; }
        .stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .stat-value { font-size: 26px; font-weight: 800; color: #0A2540; line-height: 1; }
        .stat-label { font-size: 11px; color: #94A3B8; font-weight: 600; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.04em; }
        .hero-card { border-radius: 20px; padding: 22px; color: white; }
        .hero-card h3 { color: white; font-size: 17px; font-weight: 800; margin: 0 0 4px; line-height: 1.3; }
        .hero-card p { color: rgba(255,255,255,0.75); font-size: 12px; margin: 0; }
        .white-btn { background: white; border: none; border-radius: 12px; padding: 11px 20px; font-weight: 700; font-size: 13px; cursor: pointer; width: 100%; }
        @media (min-width: 768px) {
          .db-stats { grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .db-row { flex-direction: row; }
          .db-row > * { flex: 1; }
        }
      `}</style>

      {/* Mesh gradient hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 20px 36px', marginBottom: '-16px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 30%, #4F46E5 65%, #F43F5E 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 50%, rgba(244,163,0,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(79,70,229,0.4) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', lineHeight: '1.2', margin: '0 0 4px' }}>
              {greeting}, {firstName}! {GOAL_FLAGS[profile?.career_goal] || '✨'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: 0 }}>
              {tier === 'free' ? 'Grace Plan' : tier === 'student' ? 'Student' : tier === 'nurse' ? 'Nurse Plan' : 'Passport Plan'}{profile?.career_goal ? ` · ${profile.career_goal} Track` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {profileData?.current_streak > 0 && (
              <div style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', lineHeight: 1 }}>🔥</div>
                <div style={{ fontSize: '12px', fontWeight: '900', color: 'white', marginTop: '1px' }}>{profileData.current_streak}</div>
              </div>
            )}
            {isFoundingMember && (
              <div style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center', minWidth: '64px' }}>
                <div style={{ fontSize: '18px', lineHeight: 1 }}>⭐</div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'white', marginTop: '2px', lineHeight: '1.2' }}>Founding<br />Member</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', background: '#F7F9FC', borderRadius: '20px 20px 0 0', minHeight: 'calc(100vh - 120px)' }}>

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
            <button onClick={() => navigate('/billing')} style={{ background: 'white', color: '#7C3AED', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
              Upgrade
            </button>
          </div>
        )}

        {/* Streak */}
        {profileData && <StreakBadge streak={profileData.current_streak || 0} longest={profileData.longest_streak || 0} />}

        {/* Exam Countdown */}
        {profile && <ExamCountdown profile={{ ...profile, ...profileData }} onUpdate={loadProfile} />}

        {/* Stats */}
        <div className="db-stats">
          {[
            { icon: BookOpen, label: 'Courses', value: stats.coursesStarted, bg: '#EEF2FF', ic: '#6366F1', path: '/courses' },
            { icon: TrendingUp, label: 'Modules Done', value: stats.modulesCompleted, bg: '#F0FDF4', ic: '#22C55E', path: '/courses' },
            { icon: Activity, label: 'Simulations', value: stats.simSessions, bg: '#FFF1F2', ic: '#F43F5E', path: '/simulate' },
            { icon: Award, label: 'Certificates', value: stats.certificates, bg: '#FFFBEB', ic: '#F59E0B', path: '/certificates' },
          ].map(({ icon: Icon, label, value, bg, ic, path }) => (
            <div key={label} className="stat-card" onClick={() => navigate(path)}>
              <div className="stat-icon" style={{ background: bg }}><Icon size={17} color={ic} /></div>
              <div className="stat-value">{loading ? '—' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Milestone Badges */}
        {profileData && <MilestoneBadges stats={stats} streak={profileData.current_streak || 0} />}

        {/* ClinicalSim + Weekly Challenge */}
        <div className="db-row">
          <div className="hero-card" style={{ background: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🩺</div>
            <h3>ClinicalSim AI</h3>
            <p style={{ marginBottom: '14px' }}>Practice real patient scenarios with instant AI feedback.</p>
            <button className="white-btn" style={{ color: '#F43F5E' }} onClick={() => navigate('/simulate')}>Start a Simulation →</button>
          </div>
          <div className="hero-card" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', cursor: 'pointer' }} onClick={() => navigate('/challenge')}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>⚡</div>
            <h3>Weekly Challenge</h3>
            <p style={{ marginBottom: '14px' }}>New clinical scenario every Monday. Can you complete it?</p>
            <button className="white-btn" style={{ color: '#F59E0B' }}>View Challenge →</button>
          </div>
        </div>

        {/* Leaderboard + Courses */}
        <div className="db-row">
          <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '18px', cursor: 'pointer' }} onClick={() => navigate('/leaderboard')}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>🏆 Leaderboard</div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>How do you rank?</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '14px' }}>Top nurses by streak and simulation score</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>View Leaderboard</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>›</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="hero-card" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', cursor: 'pointer' }} onClick={() => navigate('/courses')}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>📚 Courses</div>
              <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>CTG Course Now Live</h3>
              <p>CTG · Obstetrics · BLS · OSCE coming</p>
            </div>
            <div onClick={() => navigate('/certificates')} style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div style={{ fontSize: '22px' }}>🏆</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>My Certificates</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>{stats.certificates} earned</div>
              </div>
              <div style={{ color: '#D97706', fontWeight: '700', fontSize: '16px' }}>›</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Activity, Award, TrendingUp, ArrowRight, Zap, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import AppShell from '../../components/layout/AppShell'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'

export default function Dashboard() {
  const { profile, tier, isFoundingMember } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ coursesStarted: 0, modulesCompleted: 0, simSessions: 0, certificates: 0 })
  const [recentProgress, setRecentProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) loadStats()
  }, [profile])

  async function loadStats() {
    const [progressRes, simRes, certRes] = await Promise.all([
      supabase.from('user_progress').select('*').eq('user_id', profile.id),
      supabase.from('sim_sessions').select('id').eq('user_id', profile.id),
      supabase.from('certificates').select('id').eq('user_id', profile.id),
    ])
    const progress = progressRes.data || []
    const completed = progress.filter(p => p.status === 'completed')
    const courseIds = [...new Set(progress.map(p => p.course_id))]
    setStats({
      coursesStarted: courseIds.length,
      modulesCompleted: completed.length,
      simSessions: simRes.data?.length || 0,
      certificates: certRes.data?.length || 0,
    })
    if (progress.length > 0) {
      const recent = progress.slice(-3).reverse()
      const enriched = await Promise.all(recent.map(async (p) => {
        const { data: mod } = await supabase.from('modules').select('title, course_id').eq('id', p.module_id).single()
        const { data: course } = mod ? await supabase.from('courses').select('title, slug').eq('id', mod.course_id).single() : { data: null }
        return { ...p, module_title: mod?.title, course_title: course?.title, course_slug: course?.slug }
      }))
      setRecentProgress(enriched)
    }
    setLoading(false)
  }

  const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'Nurse'

  const STAT_CARDS = [
    { icon: BookOpen, label: 'Courses Started', value: stats.coursesStarted, color: 'bg-blue-50 text-blue-600', onClick: () => navigate('/courses') },
    { icon: TrendingUp, label: 'Modules Completed', value: stats.modulesCompleted, color: 'bg-green-50 text-green-600', onClick: () => navigate('/courses') },
    { icon: Activity, label: 'Sim Sessions', value: stats.simSessions, color: 'bg-purple-50 text-purple-600', onClick: () => navigate('/simulate') },
    { icon: Award, label: 'Certificates', value: stats.certificates, color: 'bg-yellow-50 text-yellow-600', onClick: () => navigate('/certificates') },
  ]

  return (
    <AppShell>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0A2540', marginBottom: '4px', lineHeight: '1.2' }}>
              {greeting}, {firstName}! {GOAL_FLAGS[profile?.career_goal] || '👋'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              {profile?.career_goal ? `Training for ${profile.career_goal} · ` : ''}{profile?.qualification || 'Nurse'}
            </p>
          </div>
          {isFoundingMember && (
            <div style={{ flexShrink: 0, background: 'rgba(244,163,0,0.1)', border: '1px solid rgba(244,163,0,0.3)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px' }}>⭐</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#0A2540' }}>Founding</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Member</div>
            </div>
          )}
        </div>
      </div>

      {tier === 'free' && (
        <div style={{ background: 'linear-gradient(135deg, #0A2540, #0D3060)', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#F4A300', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={18} color="#0A2540" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Unlock your full learning path</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Upgrade to access all courses, unlimited certificates and ClinicalSim AI</div>
            </div>
          </div>
          <Button variant="gold" size="sm" onClick={() => navigate('/billing')}>Upgrade</Button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {STAT_CARDS.map(({ icon: Icon, label, value, color, onClick }) => (
          <button key={label} onClick={onClick}
            style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }}>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`} style={{ marginBottom: '12px' }}>
              <Icon size={18} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0A2540', marginBottom: '2px' }}>
              {loading ? <div className="skeleton" style={{ height: '32px', width: '48px' }} /> : value}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>{label}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: '700', color: '#0A2540', fontSize: '16px' }}>Continue Learning</h2>
            <button onClick={() => navigate('/courses')} style={{ fontSize: '13px', color: '#00897B', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              All courses <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0A2540, #0D3060)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Featured Course</div>
                  <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', lineHeight: '1.3', marginBottom: '4px' }}>CTG Interpretation Masterclass</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>NICE (2022) · 4 modules · ~4.5 hours</p>
                </div>
                <div style={{ background: '#00897B', color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500', flexShrink: 0 }}>Flagship</div>
              </div>
              <ProgressBar value={0} max={4} color="teal" height="sm" showPercent={false} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>0 of 4 modules complete</span>
                <Button variant="gold" size="sm" onClick={() => navigate('/courses/ctg-interpretation-masterclass')}>Start Course</Button>
              </div>
            </div>
            {recentProgress.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentProgress.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/courses/${p.course_slug}/${p.module_id}`)}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: p.status === 'completed' ? '#dcfce7' : '#dbeafe', color: p.status === 'completed' ? '#16a34a' : '#2563eb', fontSize: '13px', fontWeight: '700' }}>
                      {p.status === 'completed' ? '✓' : <Clock size={14} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#0A2540', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.module_title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{p.course_title}</div>
                    </div>
                    <div style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500', background: p.status === 'completed' ? '#dcfce7' : '#dbeafe', color: p.status === 'completed' ? '#16a34a' : '#2563eb' }}>
                      {p.status === 'completed' ? 'Done' : 'In Progress'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <BookOpen size={32} color="#e2e8f0" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: '#64748B', fontSize: '13px' }}>Start a course to track your progress</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #00897B, #00796B)', borderRadius: '16px', padding: '24px' }}>
            <Activity size={28} color="rgba(255,255,255,0.8)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: 'white' }}>ClinicalSim AI</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '16px' }}>Practice real patient scenarios. Get instant clinical feedback.</p>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
              {tier === 'free' ? `${3 - (profile?.sim_sessions_used || 0)} free sessions remaining` : 'Sessions available'}
            </div>
            <button onClick={() => navigate('/simulate')}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              Start a Simulation
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>Sim Sessions</h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>This month</span>
            </div>
            <ProgressBar value={profile?.sim_sessions_used || 0} max={tier === 'free' ? 3 : tier === 'nurse' ? 20 : 999} color={tier === 'passport' ? 'gold' : 'teal'} showPercent={false} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>{profile?.sim_sessions_used || 0} used</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0A2540' }}>{tier === 'passport' ? 'Unlimited' : `${tier === 'free' ? 3 : 20} total`}</span>
            </div>
            {tier === 'free' && (
              <button onClick={() => navigate('/billing')} style={{ marginTop: '12px', fontSize: '12px', color: '#00897B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', width: '100%', textAlign: 'center' }}>
                Upgrade for 20 sessions/month →
              </button>
            )}
          </div>

          {profile?.career_goal && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
              <h3 style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px', marginBottom: '12px' }}>Your Goal</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px' }}>{GOAL_FLAGS[profile.career_goal]}</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#0A2540', fontSize: '16px' }}>{profile.career_goal}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Your target destination</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

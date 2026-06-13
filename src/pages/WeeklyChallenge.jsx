import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AppShell from '../components/layout/AppShell'

export default function WeeklyChallenge() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [daysLeft, setDaysLeft] = useState(0)
  const [challengers, setChallengers] = useState([])

  useEffect(() => { if (profile) loadChallenge() }, [profile])

  async function loadChallenge() {
    const now = new Date()
    const day = now.getUTCDay()
    const monday = new Date(now)
    monday.setUTCDate(now.getUTCDate() - (day === 0 ? 6 : day - 1))
    monday.setUTCHours(0, 0, 0, 0)
    const sunday = new Date(monday)
    sunday.setUTCDate(monday.getUTCDate() + 6)
    sunday.setUTCHours(23, 59, 59, 999)
    setDaysLeft(Math.ceil((sunday - now) / (1000 * 60 * 60 * 24)))

    const weekNum = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000))
    const { data: scenarios } = await supabase
      .from('sim_scenarios')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')

    if (!scenarios?.length) { setLoading(false); return }

    const index = weekNum % scenarios.length
    const thisScenario = scenarios[index]
    setChallenge(thisScenario)

    // Check if user completed this challenge this week
    const { data: mySessions } = await supabase
      .from('sim_sessions')
      .select('id, score')
      .eq('user_id', profile.id)
      .eq('scenario_id', thisScenario.id)
      .gte('created_at', monday.toISOString())
    setCompleted(mySessions && mySessions.length > 0)

    // Load all completions this week for leaderboard
    const { data: allSessions } = await supabase
      .from('sim_sessions')
      .select('user_id, score, created_at')
      .eq('scenario_id', thisScenario.id)
      .gte('created_at', monday.toISOString())
      .order('score', { ascending: false })
      .limit(10)

    if (allSessions?.length) {
      const userIds = [...new Set(allSessions.map(s => s.user_id))]
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, career_goal')
        .in('id', userIds)
      const profileMap = {}
      profilesData?.forEach(p => { profileMap[p.id] = p })
      setChallengers(allSessions.map(s => ({ ...s, profiles: profileMap[s.user_id] || {} })))
    } else {
      setChallengers([])
    }

    setLoading(false)
  }

  const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }
  const medals = ['🥇', '🥈', '🥉']

  if (loading) return <AppShell><div style={{ color: '#94A3B8' }}>Loading challenge...</div></AppShell>

  if (tier === 'free') {
    return (
      <AppShell>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Weekly Challenge</h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>New challenge every Monday</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '20px', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <h2 style={{ color: 'white', fontWeight: '800', fontSize: '20px', margin: '0 0 8px' }}>
            Upgrade to see how you rank
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
            Weekly clinical challenges and the live leaderboard are available on the Nurse and Passport plans. Compete with nurses across Africa every week.
          </p>
          <button onClick={() => navigate('/billing')}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
            View Plans →
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Weekly Challenge</h1>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>New challenge every Monday</p>
      </div>

      {/* Timer */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Time Remaining</div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '22px' }}>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '700' }}>This Week</div>
          <div style={{ color: completed ? '#22C55E' : '#F59E0B', fontWeight: '800', fontSize: '14px' }}>
            {completed ? '✓ Completed' : '⏳ Pending'}
          </div>
        </div>
      </div>

      {challenge && (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase' }}>This Week's Challenge</span>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>{challenge.difficulty}</span>
            </div>
            <h2 style={{ color: 'white', fontWeight: '800', fontSize: '17px', margin: '0 0 6px', lineHeight: 1.3 }}>{challenge.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
              {challenge.patient_brief?.substring(0, 120)}...
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            {completed ? (
              <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                <div style={{ fontWeight: '800', color: '#22C55E', fontSize: '15px' }}>Challenge Completed!</div>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '4px' }}>Come back next Monday for a new challenge</div>
              </div>
            ) : (
              <button onClick={() => navigate(`/simulate/${challenge.id}`, { state: { scenario: challenge } })}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
                Accept Challenge →
              </button>
            )}
            <div style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '12px' }}>
              Complete this week's challenge to earn a special badge 🏅
            </div>
          </div>
        </div>
      )}

      {/* Challenge Leaderboard */}
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>🏆 This Week's Leaderboard</h3>
      {challengers.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🩺</div>
          <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px', marginBottom: '4px' }}>No completions yet</div>
          <div style={{ color: '#94A3B8', fontSize: '12px' }}>Be the first to complete this week's challenge!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {challengers.map((s, i) => {
            const isMe = s.user_id === profile?.id
            const name = s.profiles?.full_name?.split(' ')[0] || 'Nurse'
            const flag = GOAL_FLAGS[s.profiles?.career_goal] || ''
            return (
              <div key={i} style={{
                background: isMe ? 'linear-gradient(135deg, #EEF2FF, #F0FDF4)' : 'white',
                borderRadius: '14px', padding: '14px 16px',
                border: isMe ? '2px solid #4F46E5' : '1px solid #F1F5F9',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{ width: '32px', textAlign: 'center', fontSize: i < 3 ? '22px' : '14px', fontWeight: '800', color: '#94A3B8', flexShrink: 0 }}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                  {name[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {name} {flag}
                    {isMe && <span style={{ fontSize: '10px', background: '#4F46E5', color: 'white', padding: '1px 6px', borderRadius: '99px' }}>You</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: s.score >= 70 ? '#22C55E' : '#F59E0B' }}>{s.score}%</div>
                  <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600' }}>SCORE</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}

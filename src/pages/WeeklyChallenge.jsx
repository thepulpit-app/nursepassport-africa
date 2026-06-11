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

  useEffect(() => { loadChallenge() }, [profile])

  async function loadChallenge() {
    // Get the start of the current week (Monday)
    const now = new Date()
    const day = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    // Days left in week
    const msLeft = sunday - now
    setDaysLeft(Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

    // Get this week's challenge scenario (rotate by week number)
    const weekNum = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000))
    const { data: scenarios } = await supabase
      .from('sim_scenarios')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')

    if (scenarios?.length) {
      const index = weekNum % scenarios.length
      setChallenge(scenarios[index])

      // Check if user completed this challenge this week
      const { data: sessions } = await supabase
        .from('sim_sessions')
        .select('id, score')
        .eq('user_id', profile.id)
        .eq('scenario_id', scenarios[index].id)
        .gte('created_at', monday.toISOString())

      setCompleted(sessions && sessions.length > 0)
    }
    setLoading(false)
  }

  const DIFFICULTY_COLORS = {
    beginner: { bg: '#F0FDF4', color: '#16A34A' },
    intermediate: { bg: '#FFFBEB', color: '#D97706' },
    advanced: { bg: '#FFF1F2', color: '#F43F5E' },
  }

  if (loading) return <AppShell><div style={{ color: '#94A3B8' }}>Loading challenge...</div></AppShell>

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

      {challenge ? (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase' }}>This Week's Challenge</span>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {challenge.difficulty}
              </span>
            </div>
            <h2 style={{ color: 'white', fontWeight: '800', fontSize: '17px', margin: '0 0 6px', lineHeight: 1.3 }}>{challenge.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
              {challenge.patient_brief?.substring(0, 120)}...
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            {completed ? (
              <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                <div style={{ fontWeight: '800', color: '#22C55E', fontSize: '15px' }}>Challenge Completed!</div>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '4px' }}>Come back next Monday for a new challenge</div>
              </div>
            ) : (
              <button onClick={() => navigate(`/simulate/${challenge.id}`, { state: { scenario: challenge } })}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginBottom: '12px' }}>
                Accept Challenge →
              </button>
            )}
            <div style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>
              Complete this week's challenge to earn a special badge 🏅
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>No challenge available this week</div>
      )}
    </AppShell>
  )
}

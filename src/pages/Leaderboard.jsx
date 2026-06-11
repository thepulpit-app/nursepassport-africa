import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AppShell from '../components/layout/AppShell'

export default function Leaderboard() {
  const { profile } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('streak')

  useEffect(() => { loadLeaderboard() }, [tab])

  async function loadLeaderboard() {
    setLoading(true)
    if (tab === 'streak') {
      const { data } = await supabase.from('profiles')
        .select('id, full_name, current_streak, longest_streak, career_goal')
        .order('current_streak', { ascending: false })
        .gt('current_streak', 0)
        .limit(20)
      setLeaders(data || [])
    } else {
      const { data } = await supabase.from('profiles')
        .select('id, full_name, career_goal')
        .limit(20)
      // Get sim scores
      const { data: sessions } = await supabase.from('sim_sessions')
        .select('user_id, score')
      const scoreMap = {}
      sessions?.forEach(s => {
        if (!scoreMap[s.user_id]) scoreMap[s.user_id] = []
        scoreMap[s.user_id].push(s.score || 0)
      })
      const ranked = (data || []).map(p => ({
        ...p,
        avgScore: scoreMap[p.id]?.length
          ? Math.round(scoreMap[p.id].reduce((a, b) => a + b, 0) / scoreMap[p.id].length)
          : 0,
        sessions: scoreMap[p.id]?.length || 0,
      })).filter(p => p.sessions > 0).sort((a, b) => b.avgScore - a.avgScore)
      setLeaders(ranked)
    }
    setLoading(false)
  }

  const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }
  const medals = ['🥇', '🥈', '🥉']

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Leaderboard</h1>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Top nurses this week</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'streak', label: '🔥 Streaks' },
          { key: 'scores', label: '🎯 Sim Scores' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px', background: tab === t.key ? '#0A2540' : 'white', color: tab === t.key ? 'white' : '#64748B', border: tab !== t.key ? '1.5px solid #E2E8F0' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        Array(5).fill(null).map((_, i) => (
          <div key={i} style={{ height: '64px', background: '#F1F5F9', borderRadius: '14px', marginBottom: '10px' }} />
        ))
      ) : leaders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 8px' }}>No entries yet</h3>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Be the first on the leaderboard!</p>
        </div>
      ) : leaders.map((leader, i) => {
        const isMe = leader.id === profile?.id
        return (
          <div key={leader.id} style={{
            background: isMe ? 'linear-gradient(135deg, #EEF2FF, #F0FDF4)' : 'white',
            borderRadius: '14px', padding: '14px 16px', marginBottom: '10px',
            border: isMe ? '2px solid #4F46E5' : '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ width: '32px', textAlign: 'center', fontSize: i < 3 ? '22px' : '14px', fontWeight: '800', color: '#94A3B8', flexShrink: 0 }}>
              {i < 3 ? medals[i] : `#${i + 1}`}
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
              {getInitials(leader.full_name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {leader.full_name?.split(' ')[0] || 'Nurse'}
                {isMe && <span style={{ fontSize: '10px', background: '#4F46E5', color: 'white', padding: '1px 6px', borderRadius: '99px', fontWeight: '700' }}>You</span>}
                {leader.career_goal && <span>{GOAL_FLAGS[leader.career_goal]}</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                {tab === 'streak' ? `${leader.current_streak} day streak` : `${leader.sessions} sessions`}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '20px', fontWeight: '900', color: tab === 'streak' ? '#F59E0B' : '#4F46E5' }}>
                {tab === 'streak' ? leader.current_streak : `${leader.avgScore}%`}
              </div>
              <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600' }}>
                {tab === 'streak' ? '🔥 STREAK' : '🎯 AVG'}
              </div>
            </div>
          </div>
        )
      })}
    </AppShell>
  )
}

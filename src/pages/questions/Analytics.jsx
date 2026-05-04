import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Target, Award, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'

const TRACK_COLORS = { nclex: '#4F46E5', nmc_cbt: '#F43F5E', haad: '#F59E0B', nmbn: '#22C55E' }
const TRACK_LABELS = { nclex: '🇺🇸 NCLEX-RN', nmc_cbt: '🇬🇧 NMC CBT', haad: '🇦🇪 HAAD/DHA', nmbn: '🇳🇬 NMBN' }

export default function Analytics() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [profile])

  async function loadStats() {
    const { data: attempts } = await supabase
      .from('question_attempts')
      .select('*, question_banks(track, category, difficulty)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (!attempts || attempts.length === 0) { setStats(null); setLoading(false); return }

    const total = attempts.length
    const correct = attempts.filter(a => a.is_correct).length
    const overall = Math.round((correct / total) * 100)

    const byTrack = {}
    const byCategory = {}

    attempts.forEach(a => {
      const track = a.question_banks?.track || 'unknown'
      const category = a.question_banks?.category || 'General'
      if (!byTrack[track]) byTrack[track] = { total: 0, correct: 0 }
      if (!byCategory[category]) byCategory[category] = { total: 0, correct: 0 }
      byTrack[track].total++
      byCategory[category].total++
      if (a.is_correct) { byTrack[track].correct++; byCategory[category].correct++ }
    })

    const weakAreas = Object.entries(byCategory)
      .map(([cat, d]) => ({ cat, pct: Math.round((d.correct / d.total) * 100), total: d.total }))
      .filter(x => x.pct < 60 && x.total >= 3)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5)

    setStats({ total, correct, overall, byTrack, byCategory, weakAreas, recentAttempts: attempts.slice(0, 10) })
    setLoading(false)
  }

  if (tier !== 'passport') {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0A2540', marginBottom: '8px' }}>Performance Analytics</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Track your performance by category, identify weak areas, and get AI-powered study recommendations. Passport plan only.
          </p>
          <button onClick={() => navigate('/billing')}
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A2540', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
            Upgrade to Passport
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Performance Analytics</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Track your progress and identify weak areas</p>
      </div>

      {loading ? (
        <div style={{ height: '300px', background: '#F1F5F9', borderRadius: '20px' }} />
      ) : !stats ? (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', marginBottom: '8px' }}>No data yet</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Complete some question bank practice to see your analytics.</p>
          <button onClick={() => navigate('/questions')}
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer' }}>
            Start Practising
          </button>
        </div>
      ) : (
        <>
          {/* Overall score */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { icon: Target, label: 'Overall Score', value: `${stats.overall}%`, color: stats.overall >= 70 ? '#22C55E' : '#F59E0B', bg: '#F0FDF4', ic: '#22C55E' },
              { icon: TrendingUp, label: 'Questions Done', value: stats.total, color: '#4F46E5', bg: '#EEF2FF', ic: '#4F46E5' },
              { icon: Award, label: 'Correct', value: stats.correct, color: '#22C55E', bg: '#F0FDF4', ic: '#22C55E' },
            ].map(({ icon: Icon, label, value, color, bg, ic }) => (
              <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', background: bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <Icon size={16} color={ic} />
                </div>
                <div style={{ fontSize: '22px', fontWeight: '900', color }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* By track */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Score by Track</h2>
            {Object.entries(stats.byTrack).map(([track, data]) => {
              const pct = Math.round((data.correct / data.total) * 100)
              const color = TRACK_COLORS[track] || '#64748B'
              return (
                <div key={track} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>{TRACK_LABELS[track] || track}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color }}>{pct}% ({data.correct}/{data.total})</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: '99px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Weak areas */}
          {stats.weakAreas.length > 0 && (
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #FECDD3', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <AlertCircle size={18} color="#F43F5E" />
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Weak Areas — Focus Here</h2>
              </div>
              {stats.weakAreas.map(({ cat, pct, total }) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FFF1F2', borderRadius: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#F43F5E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                    {pct}%
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{cat}</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>{total} questions attempted</div>
                  </div>
                  <button onClick={() => navigate('/questions')}
                    style={{ background: '#F43F5E', color: 'white', border: 'none', borderRadius: '8px', padding: '5px 10px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>
                    Practice
                  </button>
                </div>
              ))}
              <div style={{ background: '#EEF2FF', borderRadius: '10px', padding: '12px', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: '#4F46E5', fontWeight: '700', marginBottom: '4px' }}>🤖 AI Recommendation</div>
                <div style={{ fontSize: '12px', color: '#3730A3', lineHeight: '1.5' }}>
                  Focus your next 3 practice sessions on <strong>{stats.weakAreas[0]?.cat}</strong>. Aim for at least 20 questions in this category before your mock exam.
                </div>
              </div>
            </div>
          )}

          {/* By category */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Score by Category</h2>
            {Object.entries(stats.byCategory).sort(([,a],[,b]) => (a.correct/a.total) - (b.correct/b.total)).map(([cat, data]) => {
              const pct = Math.round((data.correct / data.total) * 100)
              const color = pct >= 70 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#F43F5E'
              return (
                <div key={cat} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#0A2540' }}>{cat}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color }}>{pct}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: '99px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </AppShell>
  )
}

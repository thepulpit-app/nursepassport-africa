import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    tierBreakdown: {},
    topScenarios: [],
    avgSimScore: 0,
    totalSessions: 0,
    totalCertificates: 0,
    certificatesThisMonth: 0,
    courseProgress: [],
    referrals: 0,
    dailySignups: [],
  })

  useEffect(() => { loadAnalytics() }, [])

  async function loadAnalytics() {
    const now = new Date()
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      usersRes, weekRes, monthRes,
      sessionsRes, certsRes, certsMonthRes,
      scenariosRes, progressRes, referralRes
    ] = await Promise.all([
      supabase.from('profiles').select('subscription_tier, created_at'),
      supabase.from('profiles').select('id').gte('created_at', weekAgo),
      supabase.from('profiles').select('id').gte('created_at', monthAgo),
      supabase.from('sim_sessions').select('score, scenario_id'),
      supabase.from('certificates').select('id', { count: 'exact', head: true }),
      supabase.from('certificates').select('id').gte('issued_at', monthAgo),
      supabase.from('sim_scenarios').select('id, title'),
      supabase.from('user_progress').select('course_id, status, courses(title)'),
      supabase.from('referral_transactions').select('id'),
    ])

    const users = usersRes.data || []
    const sessions = sessionsRes.data || []
    const scenarioMap = {}
    ;(scenariosRes.data || []).forEach((s) => { scenarioMap[s.id] = s.title })

    // Tier breakdown
    const tierBreakdown = users.reduce((acc, u) => {
      acc[u.subscription_tier] = (acc[u.subscription_tier] || 0) + 1
      return acc
    }, {})

    // Top scenarios by attempt count
    const scenarioCounts = {}
    const scenarioScores = {}
    ;(sessionsRes.data || []).forEach(s => {
      const title = scenarioMap[s.scenario_id] || s.scenario_id
      scenarioCounts[title] = (scenarioCounts[title] || 0) + 1
      if (!scenarioScores[title]) scenarioScores[title] = []
      scenarioScores[title].push(s.score || 0)
    })
    const topScenarios = Object.entries(scenarioCounts)
      .map(([title, count]) => ({
        title,
        count,
        avgScore: Math.round(scenarioScores[title].reduce((a, b) => a + b, 0) / scenarioScores[title].length)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Average sim score
    const scores = sessions.map(s => s.score || 0).filter(s => s > 0)
    const avgSimScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    // Course progress
    const courseCounts = {}
    ;(progressRes.data || []).forEach(p => {
      const title = p.courses?.title || p.course_id
      if (!courseCounts[title]) courseCounts[title] = { started: 0, completed: 0 }
      courseCounts[title].started++
      if (p.status === 'completed') courseCounts[title].completed++
    })
    const courseProgress = Object.entries(courseCounts)
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.started - a.started)

    // Daily signups last 7 days
    const dailySignups = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const count = users.filter(u => u.created_at?.startsWith(dateStr)).length
      dailySignups.push({ date: date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }), count })
    }

    setStats({
      totalUsers: users.length,
      newUsersThisWeek: weekRes.data?.length || 0,
      newUsersThisMonth: monthRes.data?.length || 0,
      tierBreakdown,
      topScenarios,
      avgSimScore,
      totalSessions: sessions.length,
      totalCertificates: certsRes.count || 0,
      certificatesThisMonth: certsMonthRes.data?.length || 0,
      courseProgress,
      referrals: referralRes.data?.length || 0,
      dailySignups,
    })
    setLoading(false)
  }

  const TIER_COLORS = {
    free: { bg: '#F1F5F9', color: '#64748B' },
    student: { bg: '#EEF2FF', color: '#4F46E5' },
    nurse: { bg: '#F0FDF4', color: '#22C55E' },
    passport: { bg: '#FFFBEB', color: '#F59E0B' },
  }

  const maxSignup = Math.max(...stats.dailySignups.map(d => d.count), 1)

  if (loading) return <div style={{ color: '#94A3B8' }}>Loading analytics...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Analytics</h1>
        <button onClick={() => { setLoading(true); loadAnalytics() }}
          style={{ padding: '8px 16px', background: '#EEF2FF', border: 'none', borderRadius: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Users', value: stats.totalUsers, sub: `+${stats.newUsersThisWeek} this week`, color: '#4F46E5', bg: '#EEF2FF' },
          { label: 'New This Month', value: stats.newUsersThisMonth, sub: 'signups in current month', color: '#22C55E', bg: '#F0FDF4' },
          { label: 'Certificates Issued', value: stats.totalCertificates, sub: `${stats.certificatesThisMonth} this month`, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Sim Sessions', value: stats.totalSessions, sub: `Avg score ${stats.avgSimScore}%`, color: '#F43F5E', bg: '#FFF1F2' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540', margin: '4px 0 2px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Daily signups chart */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 20px' }}>Signups — Last 7 Days</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
            {stats.dailySignups.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#4F46E5' }}>{d.count > 0 ? d.count : ''}</div>
                <div style={{ width: '100%', background: d.count > 0 ? 'linear-gradient(180deg, #4F46E5, #7C3AED)' : '#F1F5F9', borderRadius: '6px 6px 0 0', height: `${Math.max(4, (d.count / maxSignup) * 100)}%`, transition: 'height 0.5s' }} />
                <div style={{ fontSize: '9px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier breakdown */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Tier Breakdown</h3>
          {Object.entries(stats.tierBreakdown).sort((a, b) => b[1] - a[1]).map(([tier, count]) => {
            const t = TIER_COLORS[tier] || TIER_COLORS.free
            const pct = Math.round((count / stats.totalUsers) * 100)
            return (
              <div key={tier} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540', textTransform: 'capitalize' }}>{tier}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: t.color }}>{count} ({pct}%)</span>
                </div>
                <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, background: t.color, height: '100%', borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Top ClinicalSim scenarios */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Top ClinicalSim Scenarios</h3>
          {stats.topScenarios.length === 0 ? (
            <div style={{ color: '#94A3B8', fontSize: '13px' }}>No sessions yet</div>
          ) : stats.topScenarios.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < stats.topScenarios.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', color: '#4F46E5', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#0A2540', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{s.count} attempts · Avg {s.avgScore}%</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', background: s.avgScore >= 70 ? '#F0FDF4' : '#FFFBEB', color: s.avgScore >= 70 ? '#22C55E' : '#F59E0B', flexShrink: 0 }}>
                {s.avgScore}%
              </div>
            </div>
          ))}
        </div>

        {/* Course engagement */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Course Engagement</h3>
          {stats.courseProgress.length === 0 ? (
            <div style={{ color: '#94A3B8', fontSize: '13px' }}>No course activity yet</div>
          ) : stats.courseProgress.map((c, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#0A2540', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{c.title}</span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{c.started} started · {c.completed} done</span>
              </div>
              <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${c.started > 0 ? Math.round((c.completed / c.started) * 100) : 0}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)', height: '100%', borderRadius: '99px' }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F8FAFC' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540', marginBottom: '8px' }}>Other Metrics</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
              <span style={{ color: '#64748B' }}>Referrals made</span>
              <span style={{ fontWeight: '700', color: '#0A2540' }}>{stats.referrals}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
              <span style={{ color: '#64748B' }}>Avg sim score</span>
              <span style={{ fontWeight: '700', color: stats.avgSimScore >= 70 ? '#22C55E' : '#F59E0B' }}>{stats.avgSimScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const fs = require('fs')
let c = fs.readFileSync('src/pages/WeeklyChallenge.jsx', 'utf8')

// Add challenger leaderboard state
c = c.replace(
  "  const [daysLeft, setDaysLeft] = useState(0)",
  "  const [daysLeft, setDaysLeft] = useState(0)\n  const [challengers, setChallengers] = useState([])"
)

// Load challengers after challenge loads
c = c.replace(
  "      setCompleted(sessions && sessions.length > 0)\n    }\n    setLoading(false)",
  `      setCompleted(sessions && sessions.length > 0)

      // Load all completions this week for leaderboard
      const { data: allSessions } = await supabase
        .from('sim_sessions')
        .select('user_id, score, created_at, profiles(full_name, career_goal)')
        .eq('scenario_id', scenarios[index].id)
        .gte('created_at', monday.toISOString())
        .order('score', { ascending: false })
        .limit(10)
      setChallengers(allSessions || [])
    }
    setLoading(false)`
)

// Add leaderboard section before closing AppShell
c = c.replace(
  `    </AppShell>
}`,
  `      {/* Challenge Leaderboard */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>
          🏆 This Week's Leaderboard
        </h3>
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
              const medals = ['🥇', '🥈', '🥉']
              const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }
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
                    {i < 3 ? medals[i] : \`#\${i + 1}\`}
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
                    <div style={{ fontSize: '20px', fontWeight: '900', color: s.score >= 70 ? '#22C55E' : '#F59E0B' }}>
                      {s.score}%
                    </div>
                    <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600' }}>SCORE</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
}`
)

fs.writeFileSync('src/pages/WeeklyChallenge.jsx', c)
console.log('Done')

export default function MilestoneBadges({ stats, streak }) {
  const badges = [
    { id: 'first_sim', emoji: '🩺', label: 'First Simulation', desc: 'Complete your first ClinicalSim session', earned: stats.simSessions >= 1 },
    { id: 'sim_5', emoji: '⚡', label: 'Quick Learner', desc: 'Complete 5 simulations', earned: stats.simSessions >= 5 },
    { id: 'sim_10', emoji: '🎯', label: 'Clinical Pro', desc: 'Complete 10 simulations', earned: stats.simSessions >= 10 },
    { id: 'streak_3', emoji: '🔥', label: 'On Fire', desc: '3 day streak', earned: streak >= 3 },
    { id: 'streak_7', emoji: '🏅', label: 'Week Warrior', desc: '7 day streak', earned: streak >= 7 },
    { id: 'streak_30', emoji: '👑', label: 'Champion', desc: '30 day streak', earned: streak >= 30 },
    { id: 'first_cert', emoji: '🏆', label: 'Certified', desc: 'Earn your first certificate', earned: stats.certificates >= 1 },
    { id: 'course_start', emoji: '📚', label: 'Student', desc: 'Start your first course', earned: stats.coursesStarted >= 1 },
  ]

  const earned = badges.filter(b => b.earned)
  const unearned = badges.filter(b => !b.earned)

  if (earned.length === 0 && unearned.length === 0) return null

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '1px solid #F1F5F9', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Badges</h4>
        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{earned.length}/{badges.length} earned</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {badges.map(badge => (
          <div key={badge.id} style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px', margin: '0 auto 4px',
              background: badge.earned ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : '#F8FAFC',
              border: badge.earned ? '2px solid #F59E0B' : '2px solid #F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: badge.earned ? '24px' : '20px',
              filter: badge.earned ? 'none' : 'grayscale(100%) opacity(0.4)',
              transition: 'all 0.3s',
            }}>
              {badge.emoji}
            </div>
            <div style={{ fontSize: '9px', fontWeight: badge.earned ? '700' : '500', color: badge.earned ? '#0A2540' : '#CBD5E1', lineHeight: 1.2 }}>
              {badge.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

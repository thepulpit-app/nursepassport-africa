export default function StreakBadge({ streak, longest }) {
  if (!streak && streak !== 0) return null

  const getFlame = (s) => {
    if (s >= 30) return '🔥🔥🔥'
    if (s >= 14) return '🔥🔥'
    if (s >= 3) return '🔥'
    return '✨'
  }

  const getMessage = (s) => {
    if (s === 0) return 'Start your streak today'
    if (s === 1) return 'Day 1 — keep going!'
    if (s < 7) return `${s} day streak — building momentum`
    if (s < 14) return `${s} days — you\'re on fire!`
    if (s < 30) return `${s} days — incredible consistency!`
    return `${s} days — legend status! 🏆`
  }

  return (
    <div style={{
      background: streak > 0 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'linear-gradient(135deg, #94A3B8, #64748B)',
      borderRadius: '16px', padding: '16px 18px', color: 'white', marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '36px', lineHeight: 1 }}>{getFlame(streak)}</div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', lineHeight: 1 }}>{streak} {streak === 1 ? 'day' : 'days'}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>{getMessage(streak)}</div>
          </div>
        </div>
        {longest > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>{longest}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>BEST</div>
          </div>
        )}
      </div>
      {streak === 0 && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
          Open the app every day to build your streak. Don't break the chain! 🔗
        </div>
      )}
    </div>
  )
}

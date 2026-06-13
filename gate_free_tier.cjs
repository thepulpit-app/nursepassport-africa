const fs = require('fs')

// 1. Fix TIER_ORDER in CourseDetail.jsx
let courseDetail = fs.readFileSync('src/pages/courses/CourseDetail.jsx', 'utf8')
courseDetail = courseDetail.replace(
  "const TIER_ORDER = { free: 0, nurse: 1, passport: 2 }",
  "const TIER_ORDER = { free: -1, student: 0, nurse: 1, passport: 2 }"
)
fs.writeFileSync('src/pages/courses/CourseDetail.jsx', courseDetail)
console.log('CourseDetail.jsx updated - all modules now locked for free tier')

// 2. Gate Weekly Challenge for free tier
let challenge = fs.readFileSync('src/pages/WeeklyChallenge.jsx', 'utf8')

if (!challenge.includes('useAuth')) {
  challenge = challenge.replace(
    "import { supabase } from '../lib/supabase'",
    "import { supabase } from '../lib/supabase'\nimport { useAuth } from '../contexts/AuthContext'"
  )
}

if (!challenge.includes('const { tier }')) {
  challenge = challenge.replace(
    "export default function WeeklyChallenge() {\n  const { profile } = useAuth()",
    "export default function WeeklyChallenge() {\n  const { profile, tier } = useAuth()"
  )
}

// Add the gate right after the loading check
if (!challenge.includes('Upgrade to see how you rank')) {
  challenge = challenge.replace(
    "  if (loading) return <AppShell><div style={{ color: '#94A3B8' }}>Loading challenge...</div></AppShell>",
    `  if (loading) return <AppShell><div style={{ color: '#94A3B8' }}>Loading challenge...</div></AppShell>

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
  }`
  )
}

fs.writeFileSync('src/pages/WeeklyChallenge.jsx', challenge)
console.log('WeeklyChallenge.jsx gated for free tier')

console.log('All done!')

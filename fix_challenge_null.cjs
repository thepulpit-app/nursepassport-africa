const fs = require('fs')
let c = fs.readFileSync('src/pages/WeeklyChallenge.jsx', 'utf8')

c = c.replace(
  "  useEffect(() => { loadChallenge() }, [profile])",
  "  useEffect(() => { if (profile) loadChallenge() }, [profile])"
)

// Also guard the session query
c = c.replace(
  "    const { data: sessions } = await supabase\n        .from('sim_sessions')\n        .select('id, score')\n        .eq('user_id', profile.id)",
  "    if (!profile?.id) return\n    const { data: sessions } = await supabase\n        .from('sim_sessions')\n        .select('id, score')\n        .eq('user_id', profile.id)"
)

fs.writeFileSync('src/pages/WeeklyChallenge.jsx', c)
console.log('Done')

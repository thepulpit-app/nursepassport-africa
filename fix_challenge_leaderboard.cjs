const fs = require('fs')
let c = fs.readFileSync('src/pages/WeeklyChallenge.jsx', 'utf8')

// Replace the allSessions query with a two-step approach
c = c.replace(
  `      // Load all completions this week for leaderboard
      const { data: allSessions } = await supabase
        .from('sim_sessions')
        .select('user_id, score, created_at, profiles(full_name, career_goal)')
        .eq('scenario_id', scenarios[index].id)
        .gte('created_at', monday.toISOString())
        .order('score', { ascending: false })
        .limit(10)
      setChallengers(allSessions || [])`,
  `      // Load all completions this week for leaderboard
      const { data: allSessions } = await supabase
        .from('sim_sessions')
        .select('user_id, score, created_at')
        .eq('scenario_id', scenarios[index].id)
        .gte('created_at', monday.toISOString())
        .order('score', { ascending: false })
        .limit(10)

      if (allSessions?.length) {
        const userIds = allSessions.map(s => s.user_id)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, career_goal')
          .in('id', userIds)
        const profileMap = {}
        profilesData?.forEach(p => { profileMap[p.id] = p })
        setChallengers(allSessions.map(s => ({ ...s, profiles: profileMap[s.user_id] || {} })))
      } else {
        setChallengers([])
      }`
)

fs.writeFileSync('src/pages/WeeklyChallenge.jsx', c)
console.log('Done')

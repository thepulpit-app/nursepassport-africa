const fs = require('fs')
let c = fs.readFileSync('src/pages/Landing.jsx', 'utf8')

const regex = /(\{ name: 'Grace'.*?features: )\['2 course modules', '3 sim sessions\/month', 'Basic progress tracking', 'Daily clinical nuggets'\]/

if (regex.test(c)) {
  c = c.replace(regex, `$1['Course previews', '1 beginner sim/month', 'Leaderboard & community access', 'Daily clinical nuggets']`)
  console.log('Grace tier updated')
} else {
  console.log('NOT FOUND - Grace tier features array did not match')
}

fs.writeFileSync('src/pages/Landing.jsx', c)

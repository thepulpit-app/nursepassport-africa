const fs = require('fs')
let c = fs.readFileSync('src/pages/sim/SimHome.jsx', 'utf8')

// Show all categories always, not just when count > 0
c = c.replace(
  '{CATEGORIES.filter(cat => counts[cat.key] > 0).map(cat => (',
  '{CATEGORIES.map(cat => ('
)

fs.writeFileSync('src/pages/sim/SimHome.jsx', c)
console.log('Done')

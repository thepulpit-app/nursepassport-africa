const fs = require('fs')
let c = fs.readFileSync('src/pages/sim/SimHome.jsx', 'utf8')

// Change cat-scroll to wrap instead of scroll
c = c.replace(
  '.cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 16px; scrollbar-width: none; }',
  '.cat-scroll { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }'
)
c = c.replace(
  '.cat-scroll::-webkit-scrollbar { display: none; }',
  ''
)

fs.writeFileSync('src/pages/sim/SimHome.jsx', c)
console.log('Done')

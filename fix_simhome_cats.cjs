const fs = require('fs')
let c = fs.readFileSync('src/pages/sim/SimHome.jsx', 'utf8')

c = c.replace(
  `  { key: 'general',   label: 'General',    emoji: '🏥' },
]`,
  `  { key: 'general',   label: 'General',    emoji: '🏥' },
  { key: 'haad',      label: 'HAAD/DHA',   emoji: '🇦🇪' },
  { key: 'nclex',     label: 'NCLEX-RN',   emoji: '🇺🇸' },
]`
)

fs.writeFileSync('src/pages/sim/SimHome.jsx', c)
console.log('Categories added')

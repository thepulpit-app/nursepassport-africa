const fs = require('fs')

// 1. SimHome - lock non-beginner scenarios for free tier
let simhome = fs.readFileSync('src/pages/sim/SimHome.jsx', 'utf8')
simhome = simhome.replace(
  "const locked = remaining === 0 || (scenario.tier_required !== 'free' && tier === 'free')",
  "const locked = remaining === 0 || (scenario.tier_required !== 'free' && tier === 'free') || (tier === 'free' && scenario.difficulty !== 'beginner')"
)
fs.writeFileSync('src/pages/sim/SimHome.jsx', simhome)
console.log('SimHome.jsx updated')

// 2. paystack.js - free tier limits
let paystack = fs.readFileSync('src/lib/paystack.js', 'utf8')
paystack = paystack.replace(
  "free:     { sim_sessions: 3,        courses: true, question_banks: true },",
  "free:     { sim_sessions: 1,        courses: false, question_banks: false },"
)
fs.writeFileSync('src/lib/paystack.js', paystack)
console.log('paystack.js updated')

console.log('All done!')

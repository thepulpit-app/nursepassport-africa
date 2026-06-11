const fs = require('fs')
let c = fs.readFileSync('src/pages/WeeklyChallenge.jsx', 'utf8')

// Fix monday calculation to use UTC properly
c = c.replace(
  `    const now = new Date()
    const day = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    // Days left in week
    const msLeft = sunday - now
    setDaysLeft(Math.ceil(msLeft / (1000 * 60 * 60 * 24)))`,
  `    const now = new Date()
    // Calculate Monday in UTC
    const day = now.getUTCDay()
    const monday = new Date(now)
    monday.setUTCDate(now.getUTCDate() - (day === 0 ? 6 : day - 1))
    monday.setUTCHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setUTCDate(monday.getUTCDate() + 6)
    sunday.setUTCHours(23, 59, 59, 999)

    // Days left in week
    const msLeft = sunday - now
    setDaysLeft(Math.ceil(msLeft / (1000 * 60 * 60 * 24)))`
)

fs.writeFileSync('src/pages/WeeklyChallenge.jsx', c)
console.log('Done')

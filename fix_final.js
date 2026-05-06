const fs = require('fs')
let c = fs.readFileSync('src/App.jsx', 'utf8')

// Find AdminRoute and replace with passthrough
const result = c.replace(
  /function AdminRoute\(\{ children \}\) \{[\s\S]*?\n\}/,
  'function AdminRoute({ children }) {\n  return children\n}'
)

if (result === c) {
  console.log('No change made - showing AdminRoute:')
  const idx = c.indexOf('function AdminRoute')
  console.log(c.substring(idx, idx + 500))
} else {
  fs.writeFileSync('src/App.jsx', result)
  console.log('Done - AdminRoute is now passthrough')
}

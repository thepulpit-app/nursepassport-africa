const fs = require('fs')
let c = fs.readFileSync('src/pages/dashboard/Dashboard.jsx', 'utf8')

// Match the heading and paragraph regardless of emoji encoding
const regex = /(<h3 style=\{\{ fontSize: '14px', marginBottom: '4px' \}\}>)Courses Launching Soon(<\/h3>\s*<p>)CTG[^<]*(<\/p>)/

if (regex.test(c)) {
  c = c.replace(regex, `$1CTG Course Now Live$2CTG \u00B7 Obstetrics \u00B7 BLS \u00B7 OSCE coming$3`)
  console.log('Dashboard card updated')
} else {
  console.log('NOT FOUND - regex did not match')
}

fs.writeFileSync('src/pages/dashboard/Dashboard.jsx', c)

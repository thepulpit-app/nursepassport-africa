const fs = require('fs')
let mp = fs.readFileSync('src/pages/courses/ModulePlayer.jsx', 'utf8')

// Match the "You scored X% — well done!" line regardless of emoji/dash encoding
const regex = /(<div style=\{\{ color: 'rgba\(255,255,255,0\.75\)', fontSize: '13px' \}\}>You scored \{quizScore\}%[^<]*<\/div>)/

if (regex.test(mp)) {
  mp = mp.replace(regex, `$1\n                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '8px' }}>Your AMCC certificate will be issued once all course modules are completed.</div>`)
  console.log('Certificate note added')
} else {
  console.log('NOT FOUND - score line did not match')
}

fs.writeFileSync('src/pages/courses/ModulePlayer.jsx', mp)

const fs = require('fs')
let c = fs.readFileSync('src/pages/billing/Billing.jsx', 'utf8')

const regex = /(<p style=\{\{ color: '#94A3B8', fontSize: '13px', margin: '0 0 4px' \}\}>[^<]*Payments secured by Paystack[^<]*<\/p>)/

if (regex.test(c)) {
  c = c.replace(regex, `$1\n        <p style={{ color: '#CBD5E1', fontSize: '11px', margin: 0 }}>Card payment processing fees from Paystack may apply at checkout.</p>`)
  console.log('Fee notice added')
} else {
  console.log('NOT FOUND - Paystack line did not match')
}

fs.writeFileSync('src/pages/billing/Billing.jsx', c)

const fs = require('fs')
let c = fs.readFileSync('src/pages/About.jsx', 'utf8')

const old = `            ].map(item => (
              <div key={item.title} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>`

const updated = `            ].map(item => (
              <div key={item.title} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'center', margin: '20px 0 0' }}>
            More courses & certifications coming
          </p>
        </div>`

if (c.includes(old)) {
  c = c.replace(old, updated)
  console.log('Added "More courses & certifications coming"')
} else {
  console.log('NOT FOUND - pattern did not match')
}

fs.writeFileSync('src/pages/About.jsx', c)

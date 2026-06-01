const fs = require('fs')
let c = fs.readFileSync('src/pages/About.jsx', 'utf8')

const seminarsBlock = `
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0A2540', marginBottom: '6px' }}>
                  Seminars & Continuing Professional Development
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: '0 0 10px' }}>
                  At various stages of her career, Ibiwunmi has both attended and presented the following programmes as courses and seminars — reflecting her commitment to lifelong learning and clinical leadership:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    'IV Therapy Training Program',
                    'Basic Life Support Training',
                    'Infection Control Precautions',
                    'Workplace Violence in Healthcare Settings',
                    'Nursing Model of Care',
                    'Fire and Safety',
                    'Evidence-Based Nursing Practice',
                    'Epidural and Opioid Administration',
                    'UK NMC Registration Pathway',
                    'Canadian Nursing Licensure Process',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4F46E5', flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>`

// Insert before the credentials badges div
const target = `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>`
if (c.includes(target)) {
  c = c.replace(target, seminarsBlock + '\n              ' + target)
  fs.writeFileSync('src/pages/About.jsx', c)
  console.log('Seminars section added successfully!')
} else {
  console.log('Could not find insertion point - please check About.jsx structure')
}

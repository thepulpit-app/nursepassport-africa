const fs = require('fs')
let c = fs.readFileSync('src/pages/Landing.jsx', 'utf8')

const coursesSection = `      {/* Courses */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '99px', padding: '6px 16px', marginBottom: '16px' }}>
              <span style={{ color: '#22C55E', fontSize: '13px', fontWeight: '700' }}>\u{1F4DA} Evidence-Based Courses</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '12px' }}>
              Learn from a clinician who's been where you're going.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
              Every course is built to NICE (2022) and RCOG standards by a Registered Nurse and Midwife licensed in Nigeria, the USA and the UAE.
            </p>
          </div>

          <div className="exam-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', padding: '4px 12px', fontSize: '11px', fontWeight: '800', color: 'white', letterSpacing: '0.05em' }}>
                LIVE NOW
              </div>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>\u{1FAC0}</div>
              <h3 style={{ color: 'white', fontWeight: '800', fontSize: '20px', marginBottom: '8px' }}>CTG Interpretation Masterclass</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px', maxWidth: '480px' }}>
                Master fetal heart rate monitoring to NICE (2022) standards \u2014 covering equipment, placement, classification, and clinical decision-making for antenatal and intrapartum care.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {['NICE (2022) aligned', 'Video + reading + quiz', 'AMCC certificate'].map(t => (
                  <span key={t} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '99px', padding: '5px 12px', fontSize: '12px', fontWeight: '600' }}>{t}</span>
                ))}
              </div>
              <button className="landing-btn" onClick={() => navigate('/signup')}
                style={{ padding: '12px 24px', background: 'white', color: '#4F46E5', fontSize: '14px' }}>
                Start Learning <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="exam-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {[
              { emoji: '\u{1F6A8}', title: 'Obstetric Emergencies', desc: 'PPH, eclampsia, shoulder dystocia, cord prolapse \u2014 PROMPT-certified curriculum.' },
              { emoji: '\u{1F489}', title: 'Basic Life Support (BLS)', desc: 'AHA and ERC-aligned. Adult CPR, AED, choking management and paediatric BLS.' },
              { emoji: '\u{1F393}', title: 'NMC OSCE Preparation', desc: 'Full mock OSCE experience for nurses preparing for UK registration.' },
            ].map((course, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '99px', padding: '4px 12px', fontSize: '11px', fontWeight: '800', color: '#D97706', letterSpacing: '0.05em' }}>
                  COMING SOON
                </div>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{course.emoji}</div>
                <h3 style={{ fontWeight: '800', color: '#0A2540', fontSize: '16px', marginBottom: '8px' }}>{course.title}</h3>
                <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{course.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
              \u{1F3C6} Every completed course earns a verifiable <strong style={{ color: '#0A2540' }}>AMCC-certified certificate</strong> with a unique QR code \u2014 ready for your CV and employer verification.
            </p>
          </div>
        </div>
      </section>

`

const lines = c.split('\n')
let targetIndex = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Journey Framework')) {
    targetIndex = i
    break
  }
}

if (targetIndex === -1) {
  console.log('NOT FOUND - no line contains "Journey Framework"')
} else {
  console.log('Found "Journey Framework" comment at line', targetIndex + 1)
  console.log('Line content:', JSON.stringify(lines[targetIndex]))
  lines.splice(targetIndex, 0, coursesSection.trimEnd())
  c = lines.join('\n')
  fs.writeFileSync('src/pages/Landing.jsx', c)
  console.log('Courses section inserted before Journey Framework')
}

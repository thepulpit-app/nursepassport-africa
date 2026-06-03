const fs = require('fs')
let c = fs.readFileSync('src/pages/dashboard/Dashboard.jsx', 'utf8')

// Replace hardcoded CTG course hero with coming soon card
c = c.replace(
  `        {/* CTG Course Hero */}
        <div className="hero-card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🏆 Flagship Course</div>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>NICE 2022</span>
          </div>
          <h3>CTG Interpretation Masterclass</h3>
          <p>4 modules · ~4.5 hours · RCOG aligned</p>
          <div className="pbar-bg"><div className="pbar-fill" style={{ width: '0%' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>0 of 4 modules complete</span>
            <button className="white-btn" style={{ width: 'auto', color: '#7C3AED', padding: '9px 18px' }}
              onClick={() => navigate('/courses/ctg-interpretation-masterclass')}>
              Start Course →
            </button>
          </div>
        </div>`,
  `        {/* Courses Coming Soon */}
        <div className="hero-card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)', marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>📚 Clinical Courses</div>
          <h3>Courses Launching Soon</h3>
          <p>CTG Interpretation · Obstetric Emergencies · BLS · NMC OSCE — all coming very soon.</p>
          <div className="pbar-bg"><div className="pbar-fill" style={{ width: '15%' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Content being prepared by our Clinical Director</span>
            <button className="white-btn" style={{ width: 'auto', color: '#7C3AED', padding: '9px 18px' }}
              onClick={() => navigate('/courses')}>
              Browse →
            </button>
          </div>
        </div>`
)

fs.writeFileSync('src/pages/dashboard/Dashboard.jsx', c)
console.log('Done')

const fs = require('fs')
let c = fs.readFileSync('src/pages/courses/CourseList.jsx', 'utf8')

// Add empty state after the course grid
c = c.replace(
  `      <div className="course-grid">
        {(loading ? Array(4).fill(null) : courses).map((course, i) => {`,
  `      {!loading && courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🩺</div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: '0 0 8px' }}>Courses Coming Soon</h3>
          <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: '0 0 8px' }}>
            Our Clinical Director is preparing world-class content for:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', margin: '16px 0 24px' }}>
            {['🫀 CTG Interpretation', '🚨 Obstetric Emergencies', '💉 Basic Life Support', '🎓 NMC OSCE Preparation'].map(c => (
              <span key={c} style={{ background: '#EEF2FF', color: '#4F46E5', borderRadius: '99px', padding: '6px 14px', fontSize: '12px', fontWeight: '700' }}>{c}</span>
            ))}
          </div>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
            While you wait — practise with <strong style={{ color: '#F43F5E' }}>ClinicalSim AI</strong> and our <strong style={{ color: '#4F46E5' }}>Question Banks</strong>.
          </p>
        </div>
      )}

      <div className="course-grid">
        {(loading ? Array(4).fill(null) : courses).map((course, i) => {`
)

fs.writeFileSync('src/pages/courses/CourseList.jsx', c)
console.log('Done')

const fs = require('fs')

// 1. Fix certificates.js - count ALL modules (published or not) as the denominator
let cert = fs.readFileSync('src/lib/certificates.js', 'utf8')
cert = cert.replace(
  `    // Get all published modules for this course
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId)
      .eq('is_published', true)`,
  `    // Get ALL modules for this course (published or not) so certificates
    // are only issued once the full course is complete, not just the
    // currently-published subset.
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId)`
)
fs.writeFileSync('src/lib/certificates.js', cert)
console.log('certificates.js updated')

// 2. Add a note to ModulePlayer quiz pass screen that certificates issue after ALL modules complete
let mp = fs.readFileSync('src/pages/courses/ModulePlayer.jsx', 'utf8')

const oldBlock = `              {quizSubmitted && quizScore >= 70 && (
                  <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                    <Trophy size={32} color="#F59E0B" style={{ marginBottom: '8px' }} />
                    <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Module Complete! \u{1F389}</div>`

if (mp.includes(oldBlock)) {
  mp = mp.replace(
    oldBlock,
    oldBlock.replace(
      `<div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Module Complete! \u{1F389}</div>`,
      `<div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Module Complete! \u{1F389}</div>`
    )
  )
  // Insert note after the score line
  const scoreLine = `<div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>You scored {quizScore}% \u2014 well done!</div>`
  if (mp.includes(scoreLine)) {
    mp = mp.replace(
      scoreLine,
      `${scoreLine}\n                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '8px' }}>Your AMCC certificate will be issued once all course modules are completed.</div>`
    )
    console.log('ModulePlayer.jsx updated with certificate note')
  } else {
    console.log('NOT FOUND - score line did not match')
  }
} else {
  console.log('NOT FOUND - module complete block did not match')
}

fs.writeFileSync('src/pages/courses/ModulePlayer.jsx', mp)

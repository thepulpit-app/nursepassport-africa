const fs = require('fs')

// 1. Touch admin files to force git to detect changes
let c1 = fs.readFileSync('src/admin/pages/AdminCourses.jsx', 'utf8')
// Remove trailing space if already added
c1 = c1.trimEnd()
fs.writeFileSync('src/admin/pages/AdminCourses.jsx', c1 + '\n')

let c2 = fs.readFileSync('src/admin/pages/AdminQuizQuestions.jsx', 'utf8')
c2 = c2.trimEnd()
fs.writeFileSync('src/admin/pages/AdminQuizQuestions.jsx', c2 + '\n')

// 2. Add Admin Portal button to sidebar
let sidebar = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8')
if (!sidebar.includes('admin.html')) {
  sidebar = sidebar.replace(
    `        {profile?.is_admin && (`,
    `        {profile?.is_admin && (
          <button onClick={() => { window.location.href = '/admin' }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,163,0,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
            <Settings size={17} />
            Admin Portal
          </button>
        )}
        {false && (`
  )
  fs.writeFileSync('src/components/layout/Sidebar.jsx', sidebar)
  console.log('Admin Portal added to sidebar')
} else {
  console.log('Admin Portal already in sidebar')
}

console.log('All done!')

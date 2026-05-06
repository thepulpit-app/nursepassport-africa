const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8')

// Fix NAV array to include Question Banks and Referral
const oldNAV = `const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses',      icon: BookOpen,         label: 'Courses' },
  { to: '/simulate',     icon: Activity,         label: 'ClinicalSim AI' },
  { to: '/certificates', icon: Award,            label: 'Certificates' },
]`

const newNAV = `const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses',      icon: BookOpen,         label: 'Courses' },
  { to: '/simulate',     icon: Activity,         label: 'ClinicalSim AI' },
  { to: '/certificates', icon: Award,            label: 'Certificates' },
  { to: '/questions',    icon: ClipboardList,    label: 'Question Banks' },
  { to: '/referral',     icon: Gift,             label: 'Refer & Earn' },
]`

if (c.includes('/questions')) {
  console.log('Question Banks already in Sidebar')
} else if (c.includes(oldNAV)) {
  c = c.replace(oldNAV, newNAV)
  fs.writeFileSync('src/components/layout/Sidebar.jsx', c)
  console.log('Added Question Banks and Refer & Earn to Sidebar')
} else {
  // Try to find and patch the NAV array differently
  c = c.replace(
    "  { to: '/certificates', icon: Award,            label: 'Certificates' },\n]",
    "  { to: '/certificates', icon: Award,            label: 'Certificates' },\n  { to: '/questions',    icon: ClipboardList,    label: 'Question Banks' },\n  { to: '/referral',     icon: Gift,             label: 'Refer & Earn' },\n]"
  )
  fs.writeFileSync('src/components/layout/Sidebar.jsx', c)
  console.log('Patched Sidebar NAV array')
}

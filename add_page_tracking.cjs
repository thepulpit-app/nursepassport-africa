const fs = require('fs')
let c = fs.readFileSync('src/App.jsx', 'utf8')

// 1. Add useLocation import from react-router-dom if not present
if (!c.includes('useLocation')) {
  c = c.replace(
    /import \{ ([^}]*) \} from 'react-router-dom'/,
    (match, imports) => `import { ${imports.trim()}, useLocation } from 'react-router-dom'`
  )
}

// 2. Add useEffect import from react if not present
const reactImportMatch = c.match(/import \{ ([^}]*) \} from 'react'/)
if (reactImportMatch && !reactImportMatch[1].includes('useEffect')) {
  c = c.replace(
    /import \{ ([^}]*) \} from 'react'/,
    (match, imports) => `import { ${imports.trim()}, useEffect } from 'react'`
  )
} else if (!reactImportMatch) {
  // No react import at all - add one
  c = "import { useEffect } from 'react'\n" + c
}

// 3. Add PAGE_TITLES map and getPageTitle helper before AppRoutes
const pageTitleCode = `
const PAGE_TITLES = {
  '/': 'NursePassport Africa - Home',
  '/signup': 'Sign Up - NursePassport Africa',
  '/signin': 'Sign In - NursePassport Africa',
  '/dashboard': 'Dashboard - NursePassport Africa',
  '/courses': 'Courses - NursePassport Africa',
  '/try': 'Free Demo - NursePassport Africa',
  '/leaderboard': 'Leaderboard - NursePassport Africa',
  '/community': 'Community - NursePassport Africa',
  '/weekly-challenge': 'Weekly Challenge - NursePassport Africa',
  '/question-banks': 'Question Banks - NursePassport Africa',
  '/certificates': 'Certificates - NursePassport Africa',
  '/profile': 'Profile - NursePassport Africa',
  '/billing': 'Billing - NursePassport Africa',
  '/about': 'About AMCC - NursePassport Africa',
  '/refer': 'Refer & Earn - NursePassport Africa',
  '/nclex-preparation-nigeria': 'NCLEX-RN Preparation Nigeria - NursePassport Africa',
  '/nmc-cbt-preparation-nigeria': 'NMC CBT Preparation Nigeria - NursePassport Africa',
  '/haad-dha-exam-nigeria': 'HAAD/DHA Exam Preparation Nigeria - NursePassport Africa',
  '/nmc-osce-training-nigeria': 'NMC OSCE Training Nigeria - NursePassport Africa',
  '/ctg-training-nigeria': 'CTG Training Nigeria - NursePassport Africa',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/courses/') && pathname.includes('/module/')) return 'Course Module - NursePassport Africa'
  if (pathname.startsWith('/courses/')) return 'Course - NursePassport Africa'
  if (pathname.startsWith('/simulate/')) return 'ClinicalSim Session - NursePassport Africa'
  if (pathname.startsWith('/admin')) return 'Admin - NursePassport Africa'
  return 'NursePassport Africa'
}
`

c = c.replace('function AppRoutes() {', pageTitleCode + '\nfunction AppRoutes() {')

// 4. Add tracking useEffect inside AppRoutes, right after the function opens
c = c.replace(
  'function AppRoutes() {\n  return (',
  `function AppRoutes() {
  const location = useLocation()
  useEffect(() => {
    const title = getPageTitle(location.pathname)
    document.title = title
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: location.pathname,
      })
    }
  }, [location.pathname])

  return (`
)

fs.writeFileSync('src/App.jsx', c)
console.log('App.jsx updated with page tracking')

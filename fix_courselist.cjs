const fs = require('fs')
let c = fs.readFileSync('src/pages/courses/CourseList.jsx', 'utf8')

// Remove seed fallback — show empty state instead
c = c.replace(
  `    if (!coursesData || coursesData.length === 0) {
      setCourses(SEED_COURSES)
      setLoading(false)
      return
    }`,
  `    if (!coursesData || coursesData.length === 0) {
      setCourses([])
      setLoading(false)
      return
    }`
)

fs.writeFileSync('src/pages/courses/CourseList.jsx', c)
console.log('Done')

const fs = require('fs')
let c = fs.readFileSync('src/App.jsx', 'utf8')

const oldCode = `AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setIsAdmin(false); return }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      setIsAdmin(!!data?.is_admin)
    })
  }, [])
  if (isAdmin === null) return <LoadingScreen />
  if (!isAdmin) return <Navigate to="/admin" replace />
  return children
}`

const newCode = `AdminRoute({ children }) {
  const [adminStatus, setAdminStatus] = useState('loading')
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) { setAdminStatus('noauth'); return }
    supabase.from('profiles').select('is_admin').eq('id', user.id).single().then(({ data }) => {
      setAdminStatus(data?.is_admin ? 'ok' : 'denied')
    })
  }, [user, loading])

  if (adminStatus === 'loading') return <LoadingScreen />
  if (adminStatus === 'noauth') return <Navigate to="/admin" replace />
  if (adminStatus === 'denied') return <Navigate to="/dashboard" replace />
  return children
}`

if (c.includes(oldCode)) {
  c = c.replace(oldCode, newCode)
  fs.writeFileSync('src/App.jsx', c)
  console.log('Fixed!')
} else {
  console.log('Not found - check spacing')
}

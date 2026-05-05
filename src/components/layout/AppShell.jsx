import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '0', paddingBottom: '100px' }} className="lg-main">
        <style>{`
          @media (min-width: 1024px) {
            .lg-main { margin-left: 256px !important; padding-bottom: 0 !important; }
          }
        `}</style>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
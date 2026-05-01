import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <div style={{ marginLeft: '256px' }}>
        <main className="pb-20 lg:pb-0 min-h-screen">
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
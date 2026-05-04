import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

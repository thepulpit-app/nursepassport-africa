import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import { useTheme } from '../../contexts/ThemeContext'

export default function AppShell({ children }) {
  const { theme } = useTheme()
  console.log('Current theme:', theme?.name)

  return (
    <div style={{ minHeight: '100vh', background: theme?.bg || '#F7F9FC' }}>
      <Sidebar />
      <div style={{ marginLeft: '0', paddingBottom: '80px' }} className="lg-content">
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
          {children}
        </div>
      </div>
      <MobileNav />
      <style>{`
        @media (min-width: 1024px) {
          .lg-content {
            margin-left: 256px !important;
            padding-bottom: 0 !important;
          }
          .lg-content > div {
            padding: 32px 32px !important;
          }
        }
      `}</style>
    </div>
  )
}
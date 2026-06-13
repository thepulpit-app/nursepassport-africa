const fs = require('fs')
const data = {"css": "LyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICBEQVJLIE1PREUg4oCUIEdsb2JhbCBvdmVycmlkZXMgZm9yIGlubGluZS1zdHlsZWQgY29tcG9uZW50cwogICBBY3RpdmF0ZWQgd2hlbiA8aHRtbD4gaGFzIGNsYXNzPSJkYXJrIiAoc2V0IGJ5IFRoZW1lQ29udGV4dCkKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqLwoKaHRtbC5kYXJrIGJvZHkgewogIGJhY2tncm91bmQ6ICMwRjBGMUEgIWltcG9ydGFudDsKICBjb2xvcjogI0UyRThGMCAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgW3N0eWxlKj0iYmFja2dyb3VuZDogI0Y3RjlGQyJdLApodG1sLmRhcmsgW3N0eWxlKj0iYmFja2dyb3VuZDojRjdGOUZDIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiAjRjhGQUZDIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiNGOEZBRkMiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6ICNGQUZCRkMiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6I0ZBRkJGQyJdIHsKICBiYWNrZ3JvdW5kOiAjMEYwRjFBICFpbXBvcnRhbnQ7Cn0KCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiB3aGl0ZSJdLApodG1sLmRhcmsgW3N0eWxlKj0iYmFja2dyb3VuZDond2hpdGUnIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiAnd2hpdGUnIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiAjRkZGRkZGIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiNGRkZGRkYiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6ICNmZmYiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6I2ZmZiJdIHsKICBiYWNrZ3JvdW5kOiAjMUExQTJFICFpbXBvcnRhbnQ7CiAgYm9yZGVyLWNvbG9yOiAjMkQyRDQ0ICFpbXBvcnRhbnQ7Cn0KCmh0bWwuZGFyayBbc3R5bGUqPSJib3JkZXI6IDFweCBzb2xpZCAjRjFGNUY5Il0sCmh0bWwuZGFyayBbc3R5bGUqPSJib3JkZXI6MXB4IHNvbGlkICNGMUY1RjkiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJvcmRlcjogMS41cHggc29saWQgI0YxRjVGOSJdLApodG1sLmRhcmsgW3N0eWxlKj0iYm9yZGVyOiAxcHggc29saWQgI0UyRThGMCJdLApodG1sLmRhcmsgW3N0eWxlKj0iYm9yZGVyOjFweCBzb2xpZCAjRTJFOEYwIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJib3JkZXI6IDEuNXB4IHNvbGlkICNFMkU4RjAiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJvcmRlckNvbG9yOiAnI0YxRjVGOSciXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJvcmRlckNvbG9yOiAnI0UyRThGMCciXSB7CiAgYm9yZGVyLWNvbG9yOiAjMkQyRDQ0ICFpbXBvcnRhbnQ7Cn0KCmh0bWwuZGFyayBbc3R5bGUqPSJib3JkZXItYm90dG9tOiAxcHggc29saWQgI0YxRjVGOSJdLApodG1sLmRhcmsgW3N0eWxlKj0iYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNGMUY1RjkiXSB7CiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogIzJEMkQ0NCAhaW1wb3J0YW50Owp9Cmh0bWwuZGFyayBbc3R5bGUqPSJib3JkZXItdG9wOiAxcHggc29saWQgI0YxRjVGOSJdLApodG1sLmRhcmsgW3N0eWxlKj0iYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNGMUY1RjkiXSB7CiAgYm9yZGVyLXRvcC1jb2xvcjogIzJEMkQ0NCAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgW3N0eWxlKj0iY29sb3I6ICMwQTI1NDAiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImNvbG9yOiMwQTI1NDAiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImNvbG9yOiAnIzBBMjU0MCciXSB7CiAgY29sb3I6ICNGMUY1RjkgIWltcG9ydGFudDsKfQoKaHRtbC5kYXJrIFtzdHlsZSo9ImNvbG9yOiAjNDc1NTY5Il0sCmh0bWwuZGFyayBbc3R5bGUqPSJjb2xvcjojNDc1NTY5Il0sCmh0bWwuZGFyayBbc3R5bGUqPSJjb2xvcjogJyM0NzU1NjknIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJjb2xvcjogIzY0NzQ4QiJdLApodG1sLmRhcmsgW3N0eWxlKj0iY29sb3I6IzY0NzQ4QiJdLApodG1sLmRhcmsgW3N0eWxlKj0iY29sb3I6ICcjNjQ3NDhCJyJdIHsKICBjb2xvcjogI0NCRDVFMSAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgW3N0eWxlKj0iY29sb3I6ICM5NEEzQjgiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImNvbG9yOiM5NEEzQjgiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImNvbG9yOiAnIzk0QTNCOCciXSB7CiAgY29sb3I6ICM5NEEzQjggIWltcG9ydGFudDsKfQoKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6ICNGMUY1RjkiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6I0YxRjVGOSJdLApodG1sLmRhcmsgW3N0eWxlKj0iYmFja2dyb3VuZDogJyNGMUY1RjknIl0gewogIGJhY2tncm91bmQ6ICMyNTI1MzggIWltcG9ydGFudDsKfQoKaHRtbC5kYXJrIGlucHV0LApodG1sLmRhcmsgdGV4dGFyZWEsCmh0bWwuZGFyayBzZWxlY3QgewogIGJhY2tncm91bmQ6ICMxQTFBMkUgIWltcG9ydGFudDsKICBjb2xvcjogI0YxRjVGOSAhaW1wb3J0YW50OwogIGJvcmRlci1jb2xvcjogIzJEMkQ0NCAhaW1wb3J0YW50Owp9Cmh0bWwuZGFyayBpbnB1dDo6cGxhY2Vob2xkZXIsCmh0bWwuZGFyayB0ZXh0YXJlYTo6cGxhY2Vob2xkZXIgewogIGNvbG9yOiAjNjQ3NDhCICFpbXBvcnRhbnQ7Cn0KCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiAjRUVGMkZGIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiNFRUYyRkYiXSB7CiAgYmFja2dyb3VuZDogcmdiYSg5OSwgMTAyLCAyNDEsIDAuMTIpICFpbXBvcnRhbnQ7Cn0KaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6ICNGRkYxRjIiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6I0ZGRjFGMiJdIHsKICBiYWNrZ3JvdW5kOiByZ2JhKDI0NCwgNjMsIDk0LCAwLjEyKSAhaW1wb3J0YW50Owp9Cmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiAjRkZGQkVCIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiNGRkZCRUIiXSB7CiAgYmFja2dyb3VuZDogcmdiYSgyNDUsIDE1OCwgMTEsIDAuMTIpICFpbXBvcnRhbnQ7Cn0KaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6ICNGMEZERjQiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6I0YwRkRGNCJdIHsKICBiYWNrZ3JvdW5kOiByZ2JhKDM0LCAxOTcsIDk0LCAwLjEyKSAhaW1wb3J0YW50Owp9Cmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiAjRjVGM0ZGIl0sCmh0bWwuZGFyayBbc3R5bGUqPSJiYWNrZ3JvdW5kOiNGNUYzRkYiXSB7CiAgYmFja2dyb3VuZDogcmdiYSgxMjQsIDU4LCAyMzcsIDAuMTIpICFpbXBvcnRhbnQ7Cn0KaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6ICNGRkY3RUQiXSwKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6I0ZGRjdFRCJdIHsKICBiYWNrZ3JvdW5kOiByZ2JhKDIzNCwgODgsIDEyLCAwLjEyKSAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7IGJhY2tncm91bmQ6ICMwRjBGMUE7IH0KaHRtbC5kYXJrIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIgeyBiYWNrZ3JvdW5kOiAjMkQyRDQ0OyBib3JkZXItcmFkaXVzOiA4cHg7IH0KCmh0bWwuZGFyayBbc3R5bGUqPSJmb250RmFtaWx5OiAnbW9ub3NwYWNlJyJdLApodG1sLmRhcmsgW3N0eWxlKj0iZm9udC1mYW1pbHk6IG1vbm9zcGFjZSJdIHsKICBiYWNrZ3JvdW5kOiAjMUExQTJFICFpbXBvcnRhbnQ7CiAgY29sb3I6ICNDQkQ1RTEgIWltcG9ydGFudDsKfQoKaHRtbC5kYXJrIGJ1dHRvbltzdHlsZSo9ImJhY2tncm91bmQ6ICNGMUY1RjkiXSwKaHRtbC5kYXJrIGJ1dHRvbltzdHlsZSo9ImJhY2tncm91bmQ6I0YxRjVGOSJdIHsKICBiYWNrZ3JvdW5kOiAjMjUyNTM4ICFpbXBvcnRhbnQ7CiAgY29sb3I6ICM2NDc0OEIgIWltcG9ydGFudDsKfQoKaHRtbC5kYXJrIFtzdHlsZSo9ImJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC40KSJdLApodG1sLmRhcmsgW3N0eWxlKj0iYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjUpIl0gewogIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC43KSAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgW3N0eWxlKj0iYm9yZGVyUmFkaXVzOiAnMjRweCAyNHB4IDAgMCciXSB7CiAgYmFja2dyb3VuZDogIzFBMUEyRSAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgbmF2W2NsYXNzKj0iYmctd2hpdGUiXSB7CiAgYmFja2dyb3VuZDogIzFBMUEyRSAhaW1wb3J0YW50OwogIGJvcmRlci1jb2xvcjogIzJEMkQ0NCAhaW1wb3J0YW50Owp9CgpodG1sLmRhcmsgLmJnLXdoaXRlIHsgYmFja2dyb3VuZC1jb2xvcjogIzFBMUEyRSAhaW1wb3J0YW50OyB9Cmh0bWwuZGFyayAuYm9yZGVyLWdyYXktMjAwIHsgYm9yZGVyLWNvbG9yOiAjMkQyRDQ0ICFpbXBvcnRhbnQ7IH0KaHRtbC5kYXJrIC50ZXh0LWdyYXktNDAwIHsgY29sb3I6ICM5NEEzQjggIWltcG9ydGFudDsgfQpodG1sLmRhcmsgLnRleHQtZ3JheS02MDAgeyBjb2xvcjogI0NCRDVFMSAhaW1wb3J0YW50OyB9Cg=="}

if (!fs.existsSync('src/styles')) fs.mkdirSync('src/styles', { recursive: true })
fs.writeFileSync('src/styles/darkmode.css', Buffer.from(data.css, 'base64').toString('utf8'))
console.log('darkmode.css written')

// Import in main.jsx
let main = fs.readFileSync('src/main.jsx', 'utf8')
if (!main.includes('darkmode.css')) {
  main = main.replace(
    "import './index.css'",
    "import './index.css'\nimport './styles/darkmode.css'"
  )
  fs.writeFileSync('src/main.jsx', main)
  console.log('main.jsx updated')
}

// Add dark mode toggle to MobileNav More menu
let nav = fs.readFileSync('src/components/layout/MobileNav.jsx', 'utf8')
if (!nav.includes('toggleDarkMode')) {
  // Add useTheme import
  nav = nav.replace(
    "import { useAuth } from '../../contexts/AuthContext'",
    "import { useAuth } from '../../contexts/AuthContext'\nimport { useTheme } from '../../contexts/ThemeContext'"
  )
  // Add Moon/Sun icons
  nav = nav.replace(
    "import { LayoutDashboard, BookOpen, Activity, Award, ClipboardList, Gift, User, CreditCard, Info, X, Menu, Shield, Trophy, Zap, MessageCircle } from 'lucide-react'",
    "import { LayoutDashboard, BookOpen, Activity, Award, ClipboardList, Gift, User, CreditCard, Info, X, Menu, Shield, Trophy, Zap, MessageCircle, Moon, Sun } from 'lucide-react'"
  )
  // Add isDark, toggleDarkMode hook
  nav = nav.replace(
    "  const { profile } = useAuth()",
    "  const { profile } = useAuth()\n  const { isDark, toggleDarkMode } = useTheme()"
  )
  // Add toggle button at end of grid, before closing div
  nav = nav.replace(
    `              {profile?.is_admin && (
                <button onClick={() => { setOpen(false); window.location.href = '/admin' }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F0FDF4', borderRadius: '14px', border: '1.5px solid #BBF7D0', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} color="#22C55E" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>Admin Portal</span>
                </button>
              )}`,
    `              {profile?.is_admin && (
                <button onClick={() => { setOpen(false); window.location.href = '/admin' }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F0FDF4', borderRadius: '14px', border: '1.5px solid #BBF7D0', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} color="#22C55E" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>Admin Portal</span>
                </button>
              )}
              <button onClick={toggleDarkMode}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '14px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? '#FFFBEB' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isDark ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#CBD5E1" />}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>`
  )
  fs.writeFileSync('src/components/layout/MobileNav.jsx', nav)
  console.log('MobileNav.jsx updated with dark mode toggle')
}

console.log('All done!')

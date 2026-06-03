import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed or dismissed
    if (localStorage.getItem('pwa-dismissed')) return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show after 30 seconds on first visit
      setTimeout(() => setShow(true), 30000)
    })
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShow(false)
    setDismissed(true)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!show || dismissed) return null

  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '16px', right: '16px',
      background: 'linear-gradient(135deg, #0A2540, #1E3A5F)',
      borderRadius: '20px', padding: '20px', zIndex: 1000,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '420px', margin: '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
          🩺
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>
            Add to Home Screen
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', lineHeight: 1.5, marginBottom: '14px' }}>
            Install NursePassport Africa for quick access and offline support.
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleInstall}
              style={{ flex: 1, padding: '10px', background: 'white', color: '#0A2540', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Install App
            </button>
            <button onClick={handleDismiss}
              style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

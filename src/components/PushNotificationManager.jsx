import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function PushNotificationManager() {
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!user) return
    if (localStorage.getItem('push-dismissed')) return
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      registerServiceWorker()
      return
    }
    if (Notification.permission === 'denied') return
    // Show prompt after 2 minutes of being logged in
    setTimeout(() => setShow(true), 120000)
  }, [user])

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered:', reg.scope)
      // Save subscription to Supabase
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BE9WWZXvL1WjO99GbNMocb6PnJTi7govagvCFr7b6FQrO5wQNhVRXqnqx8Wt4-2BEvV0Wl1Rj8VTblpWpvrVfBE'
        )
      })
      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        subscription: JSON.stringify(sub),
        updated_at: new Date().toISOString()
      })
    } catch (err) {
      console.log('SW registration failed:', err)
    }
  }

  async function handleAllow() {
    setShow(false)
    const permission = await Notification.requestPermission()
    if (permission === 'granted') await registerServiceWorker()
  }

  function handleDismiss() {
    setShow(false)
    setDismissed(true)
    localStorage.setItem('push-dismissed', '1')
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)))
  }

  if (!show || dismissed) return null

  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '16px', right: '16px',
      background: 'linear-gradient(135deg, #F43F5E, #EC4899)',
      borderRadius: '20px', padding: '20px', zIndex: 1000,
      boxShadow: '0 8px 32px rgba(244,63,94,0.3)',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '420px', margin: '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
          📚
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>
            Daily Clinical Nuggets
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', lineHeight: 1.5, marginBottom: '14px' }}>
            Get a clinical tip every day to sharpen your knowledge. Never miss an exam-ready insight.
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleAllow}
              style={{ flex: 1, padding: '10px', background: 'white', color: '#F43F5E', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Yes, notify me
            </button>
            <button onClick={handleDismiss}
              style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

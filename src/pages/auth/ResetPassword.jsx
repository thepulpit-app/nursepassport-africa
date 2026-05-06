import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase puts the token in the URL hash — check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      else {
        toast.error('Invalid or expired reset link')
        navigate('/forgot-password')
      }
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    if (password !== confirm) return toast.error('Passwords do not match')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Password updated successfully!')
    navigate('/dashboard')
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#94A3B8', fontSize: '14px' }}>Verifying reset link...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <img src="/icons/icon-64.png" alt="NursePassport" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px', color: '#0A2540' }}>NursePassport Africa</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Set new password</div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0A2540', margin: '0 0 6px' }}>New Password</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 24px' }}>Choose a strong password for your account.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>New Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

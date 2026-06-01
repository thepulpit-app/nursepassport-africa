import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const BG = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }
const MESH = { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 30%, #4F46E5 65%, #F43F5E 100%)' }
const RADIAL = { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(244,163,0,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(79,70,229,0.35) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(244,63,94,0.25) 0%, transparent 50%)' }
const CARD = { position: 'relative', width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.22)', padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }
const INPUT = { width: '100%', padding: '13px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.1)', fontSize: '14px', color: 'white', outline: 'none', boxSizing: 'border-box' }
const LABEL = { display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
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
    <div style={BG}>
      <div style={MESH} />
      <div style={RADIAL} />
      <div style={{ ...CARD, textAlign: 'center' }}>
        <div style={{ color: 'white', fontSize: '14px' }}>Verifying reset link...</div>
      </div>
    </div>
  )

  return (
    <div style={BG}>
      <div style={MESH} />
      <div style={RADIAL} />
      <div style={CARD}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🩺</div>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>NursePassport Africa</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px' }}>by AMCC</div>
          </div>
        </div>

        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: '0 0 6px' }}>Set new password</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', margin: '0 0 28px' }}>Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={LABEL}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} required placeholder="At least 8 characters"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ ...INPUT, paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={LABEL}>Confirm Password</label>
            <input type="password" required placeholder="Repeat your password"
              value={confirm} onChange={e => setConfirm(e.target.value)} style={INPUT} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'white', color: '#0A2540', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

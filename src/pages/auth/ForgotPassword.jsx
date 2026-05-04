import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) return toast.error(error.message)
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link to="/signin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '32px' }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
          <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport Africa</span>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          {!sent ? (
            <>
              <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0A2540', marginBottom: '8px' }}>Reset your password</h1>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="adaeze@example.com"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }}
                    onFocus={e => e.target.style.borderColor = '#F43F5E'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '14px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #F43F5E, #EC4899)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? 'Sending...' : <><span>Send Reset Link</span> <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#F0FDF4', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>
                📧
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0A2540', marginBottom: '8px' }}>Check your email</h1>
              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                We sent a password reset link to <strong style={{ color: '#0A2540' }}>{email}</strong>. Check your inbox and click the link to reset your password.
              </p>
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} style={{ color: '#F43F5E', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  try again
                </button>
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '14px' }}>
          Remember your password?{' '}
          <Link to="/signin" style={{ color: '#F43F5E', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

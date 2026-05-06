import { useState } from 'react'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { toast.error('Invalid credentials'); setLoading(false); return }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', data.user.id).single()
    if (!profile?.is_admin) {
      await supabase.auth.signOut()
      toast.error('Access denied — admin only')
      setLoading(false)
      return
    }
    window.location.href = ('/admin/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={28} color="#F59E0B" />
          </div>
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: '24px', margin: '0 0 4px' }}>Admin Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>NursePassport Africa</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '28px' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }}
                placeholder="admin@nursepassportafrica.com" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }}
                  placeholder="Your password" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '16px' }}>
          Authorised personnel only
        </p>
      </div>
    </div>
  )
}

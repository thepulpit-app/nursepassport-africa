import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form)
    setLoading(false)
    if (error) return toast.error('Invalid email or password')
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {/* Left panel */}
      <div style={{ display: 'none', flex: 1, background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', padding: '48px', flexDirection: 'column', justifyContent: 'space-between' }} className="left-panel">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🩺</div>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>NursePassport Africa</span>
        </Link>
        <div>
          <h2 style={{ color: 'white', fontWeight: '900', fontSize: '40px', lineHeight: '1.2', marginBottom: '20px' }}>Welcome back, Nurse.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>Continue your journey to international nursing. Your courses, simulations, and certificates are waiting.</p>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '12px' }}>"ClinicalSim is like having a senior midwife beside you at 2am. The feedback is incredible."</p>
            <div style={{ fontWeight: '700', color: 'white', fontSize: '13px' }}>Funke A.</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Midwife, Abuja</div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>© 2025 AMCC · NursePassport Africa</div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🩺</div>
            <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport Africa</span>
          </Link>

          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0A2540', marginBottom: '4px' }}>Welcome back</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '32px' }}>Sign in to continue your learning journey</p>

          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Email Address</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="adaeze@example.com"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#F43F5E'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '12px', color: '#F43F5E', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Your password"
                    style={{ width: '100%', padding: '13px 48px 13px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#F43F5E'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #F43F5E, #EC4899)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight size={16} /></>}
              </button>
            </form>
            <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'20px 0'}}>
  <div style={{flex:1,height:'1px',background:'#F1F5F9'}} />
  <span style={{color:'#94A3B8',fontSize:'12px',fontWeight:'600'}}>OR</span>
  <div style={{flex:1,height:'1px',background:'#F1F5F9'}} />
</div>
<button onClick={async()=>{const {supabase}=await import('../../lib/supabase');await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/dashboard'}})}}
  style={{width:'100%',padding:'13px',background:'white',border:'1.5px solid #E2E8F0',borderRadius:'12px',fontWeight:'700',fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',color:'#0A2540'}}>
  Continue with Google
</button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#F43F5E', fontWeight: '700', textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .left-panel { display: flex !important; } }
      `}</style>
    </div>
  )
}

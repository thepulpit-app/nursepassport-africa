import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    const { error } = await signUp(form)
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Account created!')
    navigate('/onboarding')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {/* Left panel */}
      <div style={{ display: 'none', flex: 1, background: 'linear-gradient(135deg, #F43F5E, #EC4899, #A855F7)', padding: '48px', flexDirection: 'column', justifyContent: 'space-between' }} className="left-panel">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🩺</div>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>NursePassport Africa</span>
        </Link>
        <div>
          <h2 style={{ color: 'white', fontWeight: '900', fontSize: '40px', lineHeight: '1.2', marginBottom: '20px' }}>Start your international nursing journey today.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Free forever — no card required', 'NICE (2022) aligned clinical courses', 'AI-powered simulation training', 'AMCC-certified credentials', 'UK · UAE · USA · Canada pathways'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={12} color="white" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
            {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: '14px' }}>★</span>)}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '10px' }}>"My AMCC certificate was the first thing my UK recruiter asked about."</p>
          <div style={{ fontWeight: '700', color: 'white', fontSize: '13px' }}>Chidi N.</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>RN, Port Harcourt → Dubai</div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🩺</div>
            <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport Africa</span>
          </Link>

          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0A2540', marginBottom: '4px' }}>Create your account</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '32px' }}>Free forever — no card required</p>

          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <form onSubmit={handleSubmit}>
              {[
                { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Adaeze Okonkwo' },
                { key: 'email', label: 'Email Address', type: 'email', placeholder: 'adaeze@example.com' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</label>
                  <input type={type} required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#F43F5E'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              ))}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="At least 8 characters"
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
                {loading ? 'Creating account...' : <><span>Create Free Account</span> <ArrowRight size={16} /></>}
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
            <p style={{ textAlign: 'center', marginTop: '16px', color: '#94A3B8', fontSize: '12px', lineHeight: '1.5' }}>
              By creating an account you agree to AMCC's Terms of Service and Privacy Policy.
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: '#F43F5E', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .left-panel { display: flex !important; } }
      `}</style>
    </div>
  )
}

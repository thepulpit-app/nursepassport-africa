import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    const { error } = await signUp(form)
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Account created! Setting up your profile...')
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#0A2540] p-12 justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#00897B] rounded-xl flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
            NursePassport Africa
          </span>
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your international<br />career starts here.
          </h2>
          <div className="space-y-4">
            {['Train with NICE & RCOG-aligned courses', 'Practice with AI clinical simulation', 'Earn AMCC-certified credentials', 'Get placed in UK, UAE & Canada'].map(t => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00897B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <p className="text-white/80 text-sm italic mb-3">"NursePassport gave me the confidence and credentials to land my UK offer. The CTG course alone was worth it."</p>
          <div className="text-white font-semibold text-sm">Nurse Adaeze O.</div>
          <div className="text-white/50 text-xs">RN, Lagos → NHS Trust, London</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#00897B] rounded-lg flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>NursePassport Africa</span>
          </Link>

          <h1 className="text-2xl font-bold text-[#0A2540] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Create your account</h1>
          <p className="text-[#64748B] text-sm mb-8">Free forever — no card required</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="e.g. Adaeze Okonkwo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] placeholder:text-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="adaeze@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] placeholder:text-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={set('password')}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] placeholder:text-gray-400 transition-all"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A2540] transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Create Free Account
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-[#64748B]">
              By creating an account, you agree to AMCC's Terms of Service and Privacy Policy.
            </p>
          </div>

          <div className="mt-6 text-center">
            <span className="text-[#64748B] text-sm">Already have an account? </span>
            <Link to="/signin" className="text-[#00897B] font-semibold text-sm hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

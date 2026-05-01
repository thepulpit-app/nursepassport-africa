import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form)
    setLoading(false)
    if (error) return toast.error('Invalid email or password')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#00897B] rounded-lg flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>NursePassport Africa</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-[#0A2540] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Welcome back</h1>
          <p className="text-[#64748B] text-sm mb-8">Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-1.5">Email Address</label>
              <input
                type="email" required value={form.email} onChange={set('email')}
                placeholder="adaeze@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] placeholder:text-gray-400 transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-[#0A2540]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#00897B] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                  placeholder="Your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] placeholder:text-gray-400 transition-all"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A2540] transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-[#64748B] text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#00897B] font-semibold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  )
}

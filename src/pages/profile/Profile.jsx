import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Globe, Stethoscope, Save } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const GOALS = ['UK', 'UAE', 'Canada', 'USA', 'Nigeria']
const QUALIFICATIONS = ['RN', 'RM', 'RN/RM', 'Nursing Student', 'Healthcare Assistant']

export default function Profile() {
  const { profile, updateProfile, user, tier, isFoundingMember } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    qualification: profile?.qualification || '',
    career_goal: profile?.career_goal || '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSave() {
    setLoading(true)
    const { error } = await updateProfile(form)
    setLoading(false)
    if (error) return toast.error('Failed to save profile')
    toast.success('Profile updated!')
  }

  const TIER_INFO = {
    free:     { label: 'Grace (Free)', color: 'bg-gray-100 text-gray-700' },
    nurse:    { label: 'Nurse', color: 'bg-[#0A2540] text-white' },
    passport: { label: 'Passport', color: 'bg-[#F4A300] text-[#0A2540]' },
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>My Profile</h1>
        <p className="text-[#64748B] mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#0A2540] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              {profile?.full_name?.[0]?.toUpperCase() || 'N'}
            </div>
            <h3 className="font-bold text-[#0A2540] text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>{profile?.full_name}</h3>
            <p className="text-[#64748B] text-sm mb-3">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${TIER_INFO[tier]?.color}`}>
                {TIER_INFO[tier]?.label}
              </span>
              {isFoundingMember && (
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#F4A300]/20 text-[#F4A300]">
                  ⭐ Founding Member
                </span>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-[#64748B]">Member since</div>
              <div className="text-sm font-semibold text-[#0A2540] mt-0.5">
                {new Date(profile?.created_at).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/billing')}
            className="mt-4 w-full bg-[#0A2540] text-white rounded-2xl p-4 text-sm font-semibold flex items-center justify-between hover:bg-[#0D3060] transition-colors">
            <span>Manage Subscription</span>
            <span>→</span>
          </button>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#0A2540] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Edit Profile</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-1.5">Full Name</label>
              <input type="text" value={form.full_name} onChange={set('full_name')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+234..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 outline-none text-[#0A2540] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Qualification</label>
              <div className="flex flex-wrap gap-2">
                {QUALIFICATIONS.map(q => (
                  <button key={q} type="button" onClick={() => setForm(f => ({ ...f, qualification: q }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                      ${form.qualification === q ? 'border-[#00897B] bg-[#00897B]/10 text-[#00897B]' : 'border-gray-200 text-[#64748B] hover:border-gray-300'}`}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Career Goal</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button key={g} type="button" onClick={() => setForm(f => ({ ...f, career_goal: g }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                      ${form.career_goal === g ? 'border-[#0A2540] bg-[#0A2540] text-white' : 'border-gray-200 text-[#64748B] hover:border-gray-300'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="primary" onClick={handleSave} loading={loading}>
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

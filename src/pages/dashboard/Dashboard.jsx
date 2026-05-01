import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Activity, Award, TrendingUp, ArrowRight, Zap, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import AppShell from '../../components/layout/AppShell'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'

export default function Dashboard() {
  const { profile, tier, isFoundingMember } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ coursesStarted: 0, modulesCompleted: 0, simSessions: 0, certificates: 0 })
  const [recentProgress, setRecentProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) loadStats()
  }, [profile])

  async function loadStats() {
    const [progressRes, simRes, certRes] = await Promise.all([
      supabase.from('user_progress').select('*').eq('user_id', profile.id),
      supabase.from('sim_sessions').select('id').eq('user_id', profile.id),
      supabase.from('certificates').select('id').eq('user_id', profile.id),
    ])

    const progress = progressRes.data || []
    const completed = progress.filter(p => p.status === 'completed')
    const courseIds = [...new Set(progress.map(p => p.course_id))]

    setStats({
      coursesStarted: courseIds.length,
      modulesCompleted: completed.length,
      simSessions: simRes.data?.length || 0,
      certificates: certRes.data?.length || 0,
    })

    // Get recent progress with course info
    if (progress.length > 0) {
      const recent = progress.slice(-3).reverse()
      const enriched = await Promise.all(recent.map(async (p) => {
        const { data: mod } = await supabase.from('modules').select('title, course_id').eq('id', p.module_id).single()
        const { data: course } = mod ? await supabase.from('courses').select('title, slug').eq('id', mod.course_id).single() : { data: null }
        return { ...p, module_title: mod?.title, course_title: course?.title, course_slug: course?.slug }
      }))
      setRecentProgress(enriched)
    }
    setLoading(false)
  }

  const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'Nurse'

  const STAT_CARDS = [
    { icon: BookOpen, label: 'Courses Started', value: stats.coursesStarted, color: 'bg-blue-50 text-blue-600', onClick: () => navigate('/courses') },
    { icon: TrendingUp, label: 'Modules Completed', value: stats.modulesCompleted, color: 'bg-green-50 text-green-600', onClick: () => navigate('/courses') },
    { icon: Activity, label: 'Sim Sessions', value: stats.simSessions, color: 'bg-purple-50 text-purple-600', onClick: () => navigate('/simulate') },
    { icon: Award, label: 'Certificates', value: stats.certificates, color: 'bg-yellow-50 text-yellow-600', onClick: () => navigate('/certificates') },
  ]

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 fade-up">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
              {greeting}, {firstName} {GOAL_FLAGS[profile?.career_goal] || '👋'}
            </h1>
            <p className="text-[#64748B] mt-1">
              {profile?.career_goal ? `Training for ${profile.career_goal} · ` : ''}
              {profile?.qualification || 'Nurse'}
            </p>
          </div>
          {isFoundingMember && (
            <div className="flex-shrink-0 bg-[#F4A300]/10 border border-[#F4A300]/30 rounded-xl px-3 py-2 text-center">
              <div className="text-[#F4A300] text-lg">⭐</div>
              <div className="text-xs font-bold text-[#0A2540]">Founding</div>
              <div className="text-xs text-[#64748B]">Member</div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade banner for free tier */}
      {tier === 'free' && (
        <div className="fade-up-1 bg-gradient-to-r from-[#0A2540] to-[#0D3060] rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F4A300] rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-[#0A2540]" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Unlock your full learning path</div>
              <div className="text-white/60 text-xs">Upgrade to access all courses, unlimited certificates & ClinicalSim AI</div>
            </div>
          </div>
          <Button variant="gold" size="sm" onClick={() => navigate('/billing')}>
            Upgrade
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up-2">
        {STAT_CARDS.map(({ icon: Icon, label, value, color, onClick }) => (
          <button key={label} onClick={onClick}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#00897B]/20 transition-all text-left group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <div className="text-2xl font-extrabold text-[#0A2540] mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {loading ? <div className="skeleton h-8 w-12" /> : value}
            </div>
            <div className="text-xs text-[#64748B] font-medium">{label}</div>
          </button>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6 fade-up-3">
        {/* Continue learning */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>Continue Learning</h2>
              <button onClick={() => navigate('/courses')} className="text-sm text-[#00897B] font-semibold hover:underline flex items-center gap-1">
                All courses <ArrowRight size={14} />
              </button>
            </div>

            {/* CTG Featured Course */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3060] rounded-2xl p-6 mb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs text-white/60 font-medium uppercase tracking-wide mb-1">Featured Course</div>
                    <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', lineHeight: '1.3', marginBottom: '4px' }}>
                      CTG Interpretation Masterclass
                    </h3>
                    <p className="text-white/60 text-sm mt-1">NICE (2022) · 4 modules · ~4.5 hours</p>
                  </div>
                  <div className="bg-[#00897B] text-white text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                    Flagship
                  </div>
                </div>
                <ProgressBar value={0} max={4} color="teal" height="sm" showPercent={false} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/50 text-xs">0 of 4 modules complete</span>
                  <Button variant="gold" size="sm" onClick={() => navigate('/courses/ctg-interpretation-masterclass')}>
                    Start Course
                  </Button>
                </div>
              </div>

              {/* Recent activity */}
              {recentProgress.length > 0 ? (
                <div className="space-y-3">
                  {recentProgress.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/courses/${p.course_slug}/${p.module_id}`)}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${p.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {p.status === 'completed' ? '✓' : <Clock size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-[#0A2540] truncate">{p.module_title}</div>
                        <div className="text-xs text-[#64748B]">{p.course_title}</div>
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.status === 'completed' ? 'Done' : 'In Progress'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-[#64748B] text-sm">Start a course to track your progress</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* ClinicalSim CTA */}
          <div className="bg-gradient-to-br from-[#00897B] to-[#00796B] rounded-2xl p-6 text-white">
            <Activity size={28} className="mb-3 text-white/80" />
            <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>ClinicalSim AI</h3>
            <p className="text-white/70 text-sm mb-4">Practice real patient scenarios. Get instant clinical feedback.</p>
            <div className="text-xs text-white/60 mb-4">
              {tier === 'free' ? `${3 - (profile?.sim_sessions_used || 0)} free sessions remaining` : 'Sessions available'}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white hover:text-[#00897B] w-full"
              onClick={() => navigate('/simulate')}
            >
              Start a Simulation
            </Button>
          </div>

          {/* Sim sessions counter */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#0A2540] text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Sim Sessions</h3>
              <span className="text-xs text-[#64748B]">This month</span>
            </div>
            <ProgressBar
              value={profile?.sim_sessions_used || 0}
              max={tier === 'free' ? 3 : tier === 'nurse' ? 20 : 999}
              color={tier === 'passport' ? 'gold' : 'teal'}
              showPercent={false}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[#64748B]">
                {profile?.sim_sessions_used || 0} used
              </span>
              <span className="text-xs font-semibold text-[#0A2540]">
                {tier === 'passport' ? 'Unlimited' : `${tier === 'free' ? 3 : 20} total`}
              </span>
            </div>
            {tier === 'free' && (
              <button onClick={() => navigate('/billing')} className="mt-3 text-xs text-[#00897B] hover:underline font-medium w-full text-center">
                Upgrade for 20 sessions/month →
              </button>
            )}
          </div>

          {/* Career goal card */}
          {profile?.career_goal && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-[#0A2540] text-sm mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Goal</h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{GOAL_FLAGS[profile.career_goal]}</div>
                <div>
                  <div className="font-semibold text-[#0A2540]">{profile.career_goal}</div>
                  <div className="text-xs text-[#64748B]">Your target destination</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

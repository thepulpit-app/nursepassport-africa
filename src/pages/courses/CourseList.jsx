import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Lock, ChevronRight, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

const TIER_ORDER = { free: 0, nurse: 1, passport: 2 }

export default function CourseList() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCourses() }, [profile])

  async function loadCourses() {
    const { data: coursesData } = await supabase.from('courses').select('*, modules(id)').eq('is_published', true).order('sort_order')
    if (!coursesData) { setLoading(false); return }

    const { data: progressData } = await supabase.from('user_progress')
      .select('course_id, status').eq('user_id', profile.id)

    const progressMap = {}
    progressData?.forEach(p => {
      if (!progressMap[p.course_id]) progressMap[p.course_id] = { total: 0, completed: 0 }
      progressMap[p.course_id].total++
      if (p.status === 'completed') progressMap[p.course_id].completed++
    })

    setCourses(coursesData)
    setProgress(progressMap)
    setLoading(false)
  }

  const isLocked = (course) => TIER_ORDER[tier] < TIER_ORDER[course.tier_required]

  const CATEGORY_COLORS = {
    'ctg-interpretation-masterclass': 'from-[#0A2540] to-[#0D3060]',
    default: 'from-[#00897B] to-[#00796B]',
  }

  const COURSE_EMOJIS = {
    'ctg-interpretation-masterclass': '🫀',
    'basic-life-support': '🫀',
    'obstetric-emergencies': '🚨',
    default: '📚',
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>Courses</h1>
        <p className="text-[#64748B] mt-1">All courses built to NICE (2022) & RCOG standards</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : courses.length === 0 ? (
        /* Seed preview when no courses in DB yet */
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { slug: 'ctg-interpretation-masterclass', title: 'CTG Interpretation Masterclass', desc: 'Master fetal heart rate monitoring to NICE (2022) standards. Essential for UK, UAE & Nigerian practice.', modules: 4, hours: 4.5, tier_required: 'nurse', badge: 'Flagship' },
            { slug: 'basic-life-support', title: 'Basic Life Support (BLS) for Nurses', desc: 'Evidence-based BLS techniques for clinical settings. Internationally recognised.', modules: 3, hours: 2.5, tier_required: 'nurse', badge: 'Coming Soon' },
            { slug: 'obstetric-emergencies', title: 'Obstetric Emergencies', desc: 'Recognise and respond to postpartum haemorrhage, eclampsia, shoulder dystocia and more.', modules: 5, hours: 5, tier_required: 'nurse', badge: 'Coming Soon' },
            { slug: 'osce-prep', title: 'OSCE Preparation — UK NMC Track', desc: 'Simulate the NMC OSCE experience. Practice stations, communication skills, and clinical reasoning.', modules: 6, hours: 6, tier_required: 'passport', badge: 'Passport' },
          ].map((course) => {
            const locked = TIER_ORDER[tier] < TIER_ORDER[course.tier_required]
            const gradients = { 'ctg-interpretation-masterclass': 'from-[#0A2540] to-[#0D3060]', default: 'from-[#00897B] to-[#00796B]', 'osce-prep': 'from-[#F4A300] to-[#E59400]' }
            const grad = gradients[course.slug] || gradients.default
            return (
              <div key={course.slug}
                onClick={() => !locked && navigate(`/courses/${course.slug}`)}
                className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all ${locked ? 'opacity-80' : 'cursor-pointer hover:-translate-y-0.5'}`}>
                <div className={`bg-gradient-to-br ${grad} p-6`}>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-3xl">{COURSE_EMOJIS[course.slug] || '📚'}</span>
                    <div className="flex gap-1.5">
                      {course.badge && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{course.badge}</span>}
                      {locked && <span className="text-xs bg-[#F4A300] text-[#0A2540] px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Lock size={10} /> Upgrade</span>}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
                    <span className="flex items-center gap-1"><BookOpen size={11} /> {course.modules} modules</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {course.hours}h</span>
                  </div>
                </div>
                <div className="bg-white p-5">
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4">{course.desc}</p>
                  {locked ? (
                    <Button variant="outline" size="sm" fullWidth onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>
                      <Lock size={14} /> Upgrade to Access
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" fullWidth onClick={() => navigate(`/courses/${course.slug}`)}>
                      Start Course <ChevronRight size={14} />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map(course => {
            const locked = isLocked(course)
            const prog = progress[course.id]
            const moduleCount = course.modules?.length || 0
            const completedCount = prog?.completed || 0
            const percent = moduleCount > 0 ? Math.round((completedCount / moduleCount) * 100) : 0
            const grad = CATEGORY_COLORS[course.slug] || CATEGORY_COLORS.default
            const emoji = COURSE_EMOJIS[course.slug] || COURSE_EMOJIS.default
            return (
              <div key={course.id}
                onClick={() => !locked && navigate(`/courses/${course.slug}`)}
                className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all ${locked ? 'opacity-80' : 'cursor-pointer hover:-translate-y-0.5'}`}>
                <div className={`bg-gradient-to-br ${grad} p-6`}>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-3xl">{emoji}</span>
                    {locked && <span className="text-xs bg-[#F4A300] text-[#0A2540] px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Lock size={10} /> Upgrade</span>}
                  </div>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
                    <span><BookOpen size={11} className="inline mr-1" />{moduleCount} modules</span>
                    <span><Clock size={11} className="inline mr-1" />{course.estimated_hours}h</span>
                  </div>
                </div>
                <div className="bg-white p-5">
                  <p className="text-sm text-[#64748B] mb-4">{course.description}</p>
                  {prog && <ProgressBar value={completedCount} max={moduleCount} label={`${completedCount}/${moduleCount} modules`} color="teal" height="sm" />}
                  <div className="mt-4">
                    {locked ? (
                      <Button variant="outline" size="sm" fullWidth onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>
                        <Lock size={14} /> Upgrade to Access
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" fullWidth>
                        {percent === 100 ? <><CheckCircle size={14} /> Completed</> : percent > 0 ? 'Continue' : 'Start Course'}
                        {percent < 100 && <ChevronRight size={14} />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}

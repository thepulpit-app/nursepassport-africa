import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, Lock, Play, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import PaywallGate from '../../components/ui/PaywallGate'

const TIER_ORDER = { free: 0, nurse: 1, passport: 2 }

// CTG course seed data for when DB is empty
const CTG_MODULES = [
  { id: 'm1', sort_order: 1, title: 'CTG Fundamentals', description: 'The four features, NICE classification, and how to document findings', tier_required: 'free', estimated_minutes: 45 },
  { id: 'm2', sort_order: 2, title: 'Reading the Traces', description: 'Normal vs suspicious vs pathological — decelerations, variability, sinusoidal', tier_required: 'nurse', estimated_minutes: 75 },
  { id: 'm3', sort_order: 3, title: 'Real Case Application', description: 'A complete labour ward case from admission to emergency C-section', tier_required: 'nurse', estimated_minutes: 60 },
  { id: 'm4', sort_order: 4, title: 'Exam & OSCE Preparation', description: '10 timed CTG scenarios, OSCE-style questions, and certification assessment', tier_required: 'passport', estimated_minutes: 90 },
]

export default function CourseDetail() {
  const { slug } = useParams()
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCourse() }, [slug])

  async function loadCourse() {
    const { data: courseData } = await supabase.from('courses').select('*').eq('slug', slug).eq('is_published', true).single()
    if (!courseData) {
      // Use seed data
      setCourse({ title: 'CTG Interpretation Masterclass', description: 'Master fetal heart rate monitoring to NICE (2022) standards. Essential for UK, UAE & international clinical practice.', estimated_hours: 4.5 })
      setModules(CTG_MODULES)
      setLoading(false)
      return
    }
    const { data: modulesData } = await supabase.from('modules').select('*').eq('course_id', courseData.id).eq('is_published', true).order('sort_order')
    const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', profile.id).eq('course_id', courseData.id)
    const progressMap = {}
    progressData?.forEach(p => { progressMap[p.module_id] = p })
    setCourse(courseData)
    setModules(modulesData || [])
    setProgress(progressMap)
    setLoading(false)
  }

  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length
  const totalCount = modules.length

  return (
    <AppShell>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : (
        <>
          {/* Course header */}
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3060] rounded-2xl p-8 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{course?.title}</h1>
            <p className="text-white/70 mb-6">{course?.description}</p>
            <div className="flex items-center gap-6 text-white/60 text-sm mb-6">
              <span><BookOpen size={14} className="inline mr-1" />{totalCount} modules</span>
              <span><Clock size={14} className="inline mr-1" />{course?.estimated_hours}h estimated</span>
              {completedCount > 0 && <span><CheckCircle size={14} className="inline mr-1 text-[#00897B]" />{completedCount} completed</span>}
            </div>
            {completedCount > 0 && <ProgressBar value={completedCount} max={totalCount} color="teal" height="sm" showPercent={false} />}
          </div>

          {/* Modules list */}
          <h2 className="text-lg font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Course Modules</h2>
          <div className="space-y-3">
            {modules.map((module, i) => {
              const prog = progress[module.id]
              const isCompleted = prog?.status === 'completed'
              const isLocked = TIER_ORDER[tier] < TIER_ORDER[module.tier_required]
              const isFirst = i === 0

              return (
                <div key={module.id}
                  onClick={() => !isLocked && navigate(`/courses/${slug}/${module.id}`)}
                  className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 transition-all
                    ${isLocked ? 'opacity-70' : 'cursor-pointer hover:border-[#00897B]/30 hover:shadow-md'}`}>
                  {/* Step indicator */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                    ${isCompleted ? 'bg-[#00897B] text-white' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-[#0A2540] text-white'}`}>
                    {isCompleted ? <CheckCircle size={18} /> : isLocked ? <Lock size={16} /> : i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0A2540] leading-snug">{module.title}</h3>
                    <p className="text-[#64748B] text-sm mt-0.5 leading-snug">{module.description}</p>
                    {module.estimated_minutes && (
                      <div className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
                        <Clock size={11} /> {module.estimated_minutes} min
                        {module.tier_required !== 'free' && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full font-medium text-xs
                            ${module.tier_required === 'passport' ? 'bg-[#F4A300]/10 text-[#F4A300]' : 'bg-[#0A2540]/10 text-[#0A2540]'}`}>
                            {module.tier_required === 'passport' ? 'Passport' : 'Nurse'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {isLocked ? (
                      <Button variant="gold" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>Upgrade</Button>
                    ) : isCompleted ? (
                      <div className="text-xs font-semibold text-[#00897B] flex items-center gap-1"><CheckCircle size={14} /> Done</div>
                    ) : (
                      <div className="text-[#64748B]"><ChevronRight size={20} /></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </AppShell>
  )
}

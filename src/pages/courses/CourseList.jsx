import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Lock, ChevronRight, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'

const TIER_ORDER = { free: 0, nurse: 1, passport: 2 }

const SEED_COURSES = [
  {
    slug: 'ctg-interpretation-masterclass',
    title: 'CTG Interpretation Masterclass',
    description: 'Master fetal heart rate monitoring to NICE (2022) standards. Essential for UK, UAE & international clinical practice.',
    modules: 4, hours: 4.5, tier_required: 'nurse',
    badge: 'Flagship', emoji: '🫀',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    accentColor: '#7C3AED',
  },
  {
    slug: 'basic-life-support',
    title: 'Basic Life Support (BLS) for Nurses',
    description: 'Evidence-based BLS techniques for clinical settings. Internationally recognised certification.',
    modules: 3, hours: 2.5, tier_required: 'nurse',
    badge: 'Coming Soon', emoji: '❤️',
    gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)',
    accentColor: '#F43F5E',
  },
  {
    slug: 'obstetric-emergencies',
    title: 'Obstetric Emergencies',
    description: 'Recognise and respond to postpartum haemorrhage, eclampsia, shoulder dystocia and more.',
    modules: 5, hours: 5, tier_required: 'nurse',
    badge: 'Coming Soon', emoji: '🚨',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    accentColor: '#F59E0B',
  },
  {
    slug: 'osce-prep',
    title: 'OSCE Preparation — UK NMC Track',
    description: 'Simulate the NMC OSCE experience. Practice stations, communication skills, and clinical reasoning.',
    modules: 6, hours: 6, tier_required: 'passport',
    badge: 'Passport', emoji: '🎓',
    gradient: 'linear-gradient(135deg, #0A2540, #1E3A5F)',
    accentColor: '#0A2540',
  },
]

export default function CourseList() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCourses() }, [profile])

  async function loadCourses() {
    const { data: coursesData } = await supabase.from('courses').select('*, modules(id)').eq('is_published', true).order('sort_order')
    if (!coursesData || coursesData.length === 0) {
      setCourses([])
      setLoading(false)
      return
    }
    const { data: progressData } = await supabase.from('user_progress').select('course_id, status').eq('user_id', profile.id)
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

  return (
    <AppShell>
      <style>{`
        .course-card { border-radius: 20px; overflow: hidden; background: white; border: 1px solid #F1F5F9; transition: transform 0.2s, box-shadow 0.2s; }
        .course-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .course-header { padding: 20px; color: white; position: relative; }
        .course-body { padding: 16px 20px 20px; }
        .course-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .start-btn { width: 100%; padding: 12px; border-radius: 12px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        @media (min-width: 640px) { .course-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Courses</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Built to NICE (2022) & RCOG standards</p>
      </div>

      {/* Track badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {['🇬🇧 UK NMC', '🇦🇪 UAE HAAD', '🇺🇸 USA NCLEX', '🇳🇬 Nigeria'].map(track => (
          <div key={track} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '99px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
            {track}
          </div>
        ))}
      </div>

      <div className="course-grid">
        {(loading ? Array(4).fill(null) : courses).map((course, i) => {
          if (!course) return <div key={i} style={{ height: '280px', background: '#F1F5F9', borderRadius: '20px', animation: 'pulse 1.5s infinite' }} />
          const locked = isLocked(course)
          const seed = SEED_COURSES.find(s => s.slug === course.slug) || SEED_COURSES[0]
          const gradient = seed.gradient
          const emoji = seed.emoji || '📚'
          const prog = progress[course.id]
          const moduleCount = course.modules?.length || seed.modules || 0
          const completed = prog?.completed || 0
          const percent = moduleCount > 0 ? Math.round((completed / moduleCount) * 100) : 0

          return (
            <div key={course.slug || i} className="course-card"
              onClick={() => !locked && navigate(`/courses/${course.slug}`)}>
              <div className="course-header" style={{ background: gradient }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '32px', lineHeight: 1 }}>{emoji}</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {(course.badge || seed.badge) && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px' }}>
                        {course.badge || seed.badge}
                      </span>
                    )}
                    {locked && (
                      <span style={{ background: '#F59E0B', color: '#0A2540', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={9} /> Upgrade
                      </span>
                    )}
                  </div>
                </div>
                <h3 style={{ color: 'white', fontWeight: '800', fontSize: '15px', lineHeight: '1.3', margin: '0 0 6px' }}>
                  {course.title}
                </h3>
                <div style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  <span><BookOpen size={11} style={{ display: 'inline', marginRight: '3px' }} />{moduleCount} modules</span>
                  <span><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />{course.hours || seed.hours}h</span>
                </div>
                {percent > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
                      <div style={{ background: 'white', height: '100%', width: `${percent}%`, borderRadius: '99px' }} />
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', marginTop: '4px' }}>{completed}/{moduleCount} complete</div>
                  </div>
                )}
              </div>

              <div className="course-body">
                <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px' }}>
                  {course.description || seed.description}
                </p>
                {locked ? (
                  <button className="start-btn"
                    style={{ background: '#FFF1F2', color: '#F43F5E', border: '1.5px solid #FECDD3' }}
                    onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>
                    <Lock size={14} /> Upgrade to Access
                  </button>
                ) : percent === 100 ? (
                  <button className="start-btn" style={{ background: '#F0FDF4', color: '#22C55E', border: '1.5px solid #BBF7D0' }}>
                    <CheckCircle size={14} /> Completed
                  </button>
                ) : (
                  <button className="start-btn" style={{ background: gradient, color: 'white', border: 'none' }}
                    onClick={() => navigate(`/courses/${course.slug}`)}>
                    {percent > 0 ? 'Continue' : 'Start Course'} <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}

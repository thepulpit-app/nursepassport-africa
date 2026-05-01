import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, Lock, ChevronRight, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'

const TIER_ORDER = { free: 0, nurse: 1, passport: 2 }

const CTG_MODULES = [
  { id: 'm1', sort_order: 1, title: 'CTG Fundamentals', description: 'The four features, NICE classification, and how to document findings', tier_required: 'free', estimated_minutes: 45 },
  { id: 'm2', sort_order: 2, title: 'Reading the Traces', description: 'Normal vs suspicious vs pathological — decelerations, variability, sinusoidal', tier_required: 'nurse', estimated_minutes: 75 },
  { id: 'm3', sort_order: 3, title: 'Real Case Application', description: 'A complete labour ward case from admission to emergency C-section', tier_required: 'nurse', estimated_minutes: 60 },
  { id: 'm4', sort_order: 4, title: 'Exam & OSCE Preparation', description: '10 timed CTG scenarios, OSCE-style questions, and certification assessment', tier_required: 'passport', estimated_minutes: 90 },
]

const TIER_BADGE = {
  free: { label: 'Free', bg: '#F0FDF4', color: '#16A34A' },
  nurse: { label: 'Nurse', bg: '#EEF2FF', color: '#4F46E5' },
  passport: { label: 'Passport', bg: '#FFF7ED', color: '#F59E0B' },
}

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
      setCourse({ title: 'CTG Interpretation Masterclass', description: 'Master fetal heart rate monitoring to NICE (2022) standards. Essential for UK, UAE & international clinical practice.', estimated_hours: 4.5, slug })
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
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <AppShell>
      <style>{`
        .module-card { background: white; border-radius: 16px; border: 1px solid #F1F5F9; padding: 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .module-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .module-num { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; }
      `}</style>

      {/* Back */}
      <button onClick={() => navigate('/courses')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '20px', padding: 0 }}>
        <ArrowLeft size={16} /> Back to Courses
      </button>

      {loading ? (
        <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '20px' }} />
      ) : (
        <>
          {/* Course header */}
          <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '20px', padding: '24px', marginBottom: '24px', color: 'white' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              🏆 Flagship Course
            </div>
            <h1 style={{ color: 'white', fontWeight: '800', fontSize: '20px', lineHeight: '1.3', margin: '0 0 8px' }}>{course?.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: '0 0 16px', lineHeight: '1.5' }}>{course?.description}</p>
            <div style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '14px' }}>
              <span><BookOpen size={13} style={{ display: 'inline', marginRight: '4px' }} />{totalCount} modules</span>
              <span><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />{course?.estimated_hours}h</span>
              {completedCount > 0 && <span><CheckCircle size={13} style={{ display: 'inline', marginRight: '4px', color: '#4ADE80' }} />{completedCount} done</span>}
            </div>
            {completedCount > 0 && (
              <div>
                <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '99px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ background: 'white', height: '100%', width: `${percent}%`, borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>{percent}% complete</div>
              </div>
            )}
          </div>

          {/* Modules */}
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>Course Modules</h2>

          {modules.map((module, i) => {
            const prog = progress[module.id]
            const isCompleted = prog?.status === 'completed'
            const isLocked = TIER_ORDER[tier] < TIER_ORDER[module.tier_required]
            const badge = TIER_BADGE[module.tier_required]

            return (
              <div key={module.id} className="module-card"
                style={{ opacity: isLocked ? 0.75 : 1 }}
                onClick={() => !isLocked && navigate(`/courses/${slug}/${module.id}`)}>
                <div className="module-num" style={{
                  background: isCompleted ? '#F0FDF4' : isLocked ? '#F8FAFC' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  color: isCompleted ? '#22C55E' : isLocked ? '#94A3B8' : 'white'
                }}>
                  {isCompleted ? <CheckCircle size={18} /> : isLocked ? <Lock size={16} /> : i + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px', marginBottom: '3px', lineHeight: '1.3' }}>{module.title}</div>
                  <div style={{ color: '#94A3B8', fontSize: '12px', lineHeight: '1.4', marginBottom: '4px' }}>{module.description}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {module.estimated_minutes && (
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}><Clock size={10} style={{ display: 'inline' }} /> {module.estimated_minutes} min</span>
                    )}
                    {module.tier_required !== 'free' && (
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '99px', background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isLocked ? (
                    <button style={{ background: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>
                      Upgrade
                    </button>
                  ) : isCompleted ? (
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#22C55E', background: '#F0FDF4', padding: '4px 10px', borderRadius: '99px' }}>Done ✓</span>
                  ) : (
                    <ChevronRight size={18} color="#CBD5E1" />
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}
    </AppShell>
  )
}

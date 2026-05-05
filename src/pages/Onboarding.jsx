import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const QUALIFICATIONS = ['RN', 'RM', 'RN/RM', 'Nursing Student', 'Healthcare Assistant']

const GOALS = [
  { value: 'UK', flag: '🇬🇧', label: 'United Kingdom', sub: 'NMC CBT & OSCE' },
  { value: 'UAE', flag: '🇦🇪', label: 'UAE', sub: 'HAAD / DHA exam' },
  { value: 'USA', flag: '🇺🇸', label: 'USA', sub: 'NCLEX-RN' },
  { value: 'Canada', flag: '🇨🇦', label: 'Canada', sub: 'NCLEX-RN + provincial' },
  { value: 'Nigeria', flag: '🇳🇬', label: 'Nigeria', sub: 'Local practice' },
]

const DIAGNOSTIC_QUESTIONS = [
  { id: 'q1', question: 'On a CTG trace, a baseline fetal heart rate of 165 bpm for 40 minutes is classified as:', options: ['Normal', 'Tachycardia (suspicious)', 'Tachycardia (pathological)', 'Bradycardia'], correct: 'b' },
  { id: 'q2', question: 'A sinusoidal CTG pattern is always classified as:', options: ['Normal', 'Suspicious', 'Pathological', 'Non-reassuring'], correct: 'c' },
  { id: 'q3', question: 'Late decelerations on a CTG trace most commonly indicate:', options: ['Head compression', 'Cord compression', 'Uteroplacental insufficiency', 'Normal response to contractions'], correct: 'c' },
  { id: 'q4', question: 'Normal baseline variability on a CTG is defined as:', options: ['< 2 bpm', '2-5 bpm', '5-25 bpm', '> 25 bpm'], correct: 'c' },
  { id: 'q5', question: 'A prolonged deceleration lasting more than how many minutes requires immediate action?', options: ['1 minute', '2 minutes', '3 minutes', '5 minutes'], correct: 'c' },
]

export default function Onboarding() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [profile, setProfileData] = useState({ qualification: '', career_goal: '' })

  async function handleProfileNext() {
    if (!profile.qualification || !profile.career_goal) return toast.error('Please select your qualification and career goal')
    setLoading(true)
    try {
      await updateProfile({ qualification: profile.qualification, career_goal: profile.career_goal })
      setStep(2)
    } catch (e) {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  function handleAnswer(questionId, option) {
    const newAnswers = { ...answers, [questionId]: option }
    setAnswers(newAnswers)
    if (currentQ < DIAGNOSTIC_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 350)
    } else {
      setTimeout(() => finishDiagnostic(newAnswers), 350)
    }
  }

  async function finishDiagnostic(finalAnswers) {
    const score = DIAGNOSTIC_QUESTIONS.reduce((acc, q, i) => acc + (finalAnswers[`q${i + 1}`] === q.correct ? 1 : 0), 0)
    const percent = Math.round((score / DIAGNOSTIC_QUESTIONS.length) * 100)
    const path = percent >= 80 ? 'advanced' : percent >= 50 ? 'intermediate' : 'beginner'
    setLoading(true)
    try {
      await supabase.from('diagnostic_results').insert({ user_id: user.id, answers: finalAnswers, score: percent, recommended_path: path })
    } catch (e) { console.log(e) }
    await updateProfile({ diagnostic_completed: true, diagnostic_score: percent })
    setLoading(false)
    setStep(3)
  }

  const diagnosticScore = () => {
    const score = DIAGNOSTIC_QUESTIONS.reduce((acc, q, i) => acc + (answers[`q${i + 1}`] === q.correct ? 1 : 0), 0)
    return Math.round((score / DIAGNOSTIC_QUESTIONS.length) * 100)
  }

  const getPath = () => {
    const s = diagnosticScore()
    if (s >= 80) return { label: 'Advanced Track', desc: 'Strong foundations. We\'ll focus on complex scenarios and OSCE prep.', gradient: 'linear-gradient(135deg, #22C55E, #16A34A)' }
    if (s >= 50) return { label: 'Intermediate Track', desc: 'Good foundation. We\'ll fill key knowledge gaps and build confidence.', gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }
    return { label: 'Foundation Track', desc: 'We\'ll start from the fundamentals and build your expertise step by step.', gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)' }
  }

  const STEPS = ['Profile', 'Diagnostic', 'Your Path']

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🩺</div>
          <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '16px' }}>NursePassport Africa</span>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', transition: 'all 0.3s',
                background: step === i + 1 ? 'linear-gradient(135deg, #F43F5E, #EC4899)' : step > i + 1 ? '#F0FDF4' : '#F1F5F9',
                color: step === i + 1 ? 'white' : step > i + 1 ? '#22C55E' : '#94A3B8' }}>
                {step > i + 1 ? <CheckCircle size={12} /> : <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: step === i + 1 ? 'rgba(255,255,255,0.3)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{i + 1}</span>}
                {s}
              </div>
              {i < STEPS.length - 1 && <div style={{ width: '20px', height: '2px', background: step > i + 1 ? '#22C55E' : '#E2E8F0', borderRadius: '99px' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0A2540', marginBottom: '4px' }}>Tell us about yourself</h1>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>This helps us personalise your learning path.</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Your Qualification</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {QUALIFICATIONS.map(q => (
                    <button key={q} type="button" onClick={() => setProfileData(p => ({ ...p, qualification: q }))}
                      style={{ padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid', borderColor: profile.qualification === q ? '#F43F5E' : '#E2E8F0', background: profile.qualification === q ? '#FFF1F2' : 'white', color: profile.qualification === q ? '#F43F5E' : '#64748B' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Your Career Goal</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {GOALS.map(g => (
                    <button key={g.value} type="button" onClick={() => setProfileData(p => ({ ...p, career_goal: g.value }))}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid', borderColor: profile.career_goal === g.value ? '#F43F5E' : '#E2E8F0', background: profile.career_goal === g.value ? '#FFF1F2' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '22px' }}>{g.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{g.label}</div>
                        <div style={{ color: '#94A3B8', fontSize: '12px' }}>{g.sub}</div>
                      </div>
                      {profile.career_goal === g.value && <CheckCircle size={18} color="#F43F5E" />}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleProfileNext} disabled={loading}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? 'Saving...' : <>Continue <ChevronRight size={16} /></>}
              </button>
            </div>
          )}

          {/* STEP 2 — Diagnostic */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0A2540' }}>Quick Diagnostic</h1>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>{currentQ + 1}/{DIAGNOSTIC_QUESTIONS.length}</span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>5 questions to personalise your learning path. No pressure.</p>

              {/* Progress */}
              <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '6px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', height: '100%', width: `${(currentQ / DIAGNOSTIC_QUESTIONS.length) * 100}%`, borderRadius: '99px', transition: 'width 0.4s ease' }} />
              </div>

              <p style={{ fontWeight: '700', color: '#0A2540', fontSize: '15px', lineHeight: '1.5', marginBottom: '16px' }}>
                {DIAGNOSTIC_QUESTIONS[currentQ]?.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DIAGNOSTIC_QUESTIONS[currentQ]?.options.map((opt, i) => {
                  const letter = ['a', 'b', 'c', 'd'][i]
                  const selected = answers[DIAGNOSTIC_QUESTIONS[currentQ].id] === letter
                  return (
                    <button key={i} type="button"
                      onClick={() => handleAnswer(DIAGNOSTIC_QUESTIONS[currentQ].id, letter)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1.5px solid', borderColor: selected ? '#F43F5E' : '#E2E8F0', background: selected ? '#FFF1F2' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0, background: selected ? '#F43F5E' : '#F8FAFC', color: selected ? 'white' : '#94A3B8' }}>
                        {letter.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: selected ? '#F43F5E' : '#0A2540' }}>{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — Result */}
          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', background: '#FFF1F2', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>
                🎯
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0A2540', marginBottom: '6px' }}>Your path is ready!</h1>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>
                You scored <strong style={{ color: '#0A2540' }}>{diagnosticScore()}%</strong> on the diagnostic.
              </p>

              <div style={{ background: getPath().gradient, borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '6px' }}>{getPath().label}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.5' }}>{getPath().desc}</div>
              </div>

              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px', marginBottom: '4px' }}>⭐ You're a Founding Member!</div>
                <div style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.5' }}>You're among the first 50 nurses on NursePassport Africa. Your feedback will shape this platform.</div>
              </div>

              <button onClick={() => navigate(profile?.qualification === 'Nursing Student' ? '/student-registration' : '/dashboard')}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Go to My Dashboard <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

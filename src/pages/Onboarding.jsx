import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const QUALIFICATIONS = ['RN', 'RM', 'RN/RM', 'Nursing Student', 'Healthcare Assistant']
const GOALS = [
  { value: 'UK', label: '🇬🇧 United Kingdom (NMC)', desc: 'NHS & private hospitals' },
  { value: 'UAE', label: '🇦🇪 UAE (HAAD/DHA)', desc: 'Dubai, Abu Dhabi' },
  { value: 'Canada', label: '🇨🇦 Canada (NCLEX)', desc: 'Provincial registration' },
  { value: 'USA', label: '🇺🇸 USA (NCLEX-RN)', desc: 'CGFNS & state boards' },
  { value: 'Nigeria', label: '🇳🇬 Nigeria', desc: 'Local practice & hospitals' },
]

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    question: 'On a CTG trace, a baseline fetal heart rate of 165 bpm for 40 minutes is classified as:',
    options: ['Normal', 'Tachycardia (suspicious)', 'Tachycardia (pathological)', 'Bradycardia'],
    correct: 'b',
    topic: 'ctg_basics'
  },
  {
    id: 'q2',
    question: 'A sinusoidal CTG pattern is always classified as:',
    options: ['Normal', 'Suspicious', 'Pathological', 'Non-reassuring'],
    correct: 'c',
    topic: 'ctg_patterns'
  },
  {
    id: 'q3',
    question: 'Late decelerations on a CTG trace most commonly indicate:',
    options: ['Head compression', 'Cord compression', 'Uteroplacental insufficiency', 'Normal response to contractions'],
    correct: 'c',
    topic: 'decelerations'
  },
  {
    id: 'q4',
    question: 'Normal baseline variability on a CTG is defined as:',
    options: ['< 2 bpm', '2-5 bpm', '5-25 bpm', '> 25 bpm'],
    correct: 'c',
    topic: 'variability'
  },
  {
    id: 'q5',
    question: 'A prolonged deceleration lasting more than how many minutes requires immediate action?',
    options: ['1 minute', '2 minutes', '3 minutes', '5 minutes'],
    correct: 'c',
    topic: 'escalation'
  },
]

export default function Onboarding() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: profile, 2: diagnostic, 3: result
  const [loading, setLoading] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [profile, setProfileData] = useState({ qualification: '', career_goal: '', phone: '' })

  const STEPS = ['Profile', 'Diagnostic', 'Your Path']

async function handleProfileNext() {
  if (!profile.qualification || !profile.career_goal) {
    return toast.error('Please select your qualification and career goal')
  }
  setLoading(true)
  try {
    const { error } = await updateProfile({ 
      qualification: profile.qualification, 
      career_goal: profile.career_goal, 
      phone: profile.phone 
    })
    if (error) {
      console.log('Profile update error:', error)
      toast.error('Could not save profile. Please try again.')
      setLoading(false)
      return
    }
    setStep(2)
  } catch (e) {
    console.log('Error:', e)
    toast.error('Something went wrong. Please try again.')
  }
  setLoading(false)
}

  function handleAnswer(questionId, option) {
    const newAnswers = { ...answers, [questionId]: option }
    setAnswers(newAnswers)
    if (currentQ < DIAGNOSTIC_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 400)
    } else {
      setTimeout(() => finishDiagnostic(newAnswers), 400)
    }
  }

async function finishDiagnostic(finalAnswers) {
  const score = DIAGNOSTIC_QUESTIONS.reduce((acc, q, i) => {
    const key = `q${i + 1}`
    return acc + (finalAnswers[key] === q.correct ? 1 : 0)
  }, 0)
  const percent = Math.round((score / DIAGNOSTIC_QUESTIONS.length) * 100)
  const path = percent >= 80 ? 'advanced' : percent >= 50 ? 'intermediate' : 'beginner'

  setLoading(true)
  try {
    await supabase.from('diagnostic_results').insert({
      user_id: user.id,
      answers: finalAnswers,
      score: percent,
      recommended_path: path
    })
  } catch (e) {
    console.log('Diagnostic save error:', e)
  }
  await updateProfile({ diagnostic_completed: true, diagnostic_score: percent })
  setLoading(false)
  setStep(3)
}

  const diagnosticScore = () => {
    const score = DIAGNOSTIC_QUESTIONS.reduce((acc, q, i) => {
      return acc + (answers[`q${i + 1}`] === q.correct ? 1 : 0)
    }, 0)
    return Math.round((score / DIAGNOSTIC_QUESTIONS.length) * 100)
  }

  const getPath = () => {
    const s = diagnosticScore()
    if (s >= 80) return { label: 'Advanced Track', desc: 'You have strong foundations. We\'ll focus on complex scenarios and OSCE prep.', color: 'bg-[#00897B]' }
    if (s >= 50) return { label: 'Intermediate Track', desc: 'Good foundation. We\'ll fill key knowledge gaps and build clinical confidence.', color: 'bg-[#0A2540]' }
    return { label: 'Foundation Track', desc: 'We\'ll start from the fundamentals and build your expertise step by step.', color: 'bg-[#F4A300]' }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-[#00897B] rounded-lg flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>NursePassport Africa</span>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all
                ${step === i + 1 ? 'bg-[#0A2540] text-white' : step > i + 1 ? 'bg-[#00897B] text-white' : 'bg-gray-200 text-gray-400'}`}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs">
                  {step > i + 1 ? '✓' : i + 1}
                </span>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-0.5 rounded ${step > i + 1 ? 'bg-[#00897B]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Step 1: Profile */}
          {step === 1 && (
            <div className="fade-up">
              <h1 className="text-2xl font-bold text-[#0A2540] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Tell us about yourself</h1>
              <p className="text-[#64748B] text-sm mb-6">This helps us personalise your learning path.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Your Qualification</label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUALIFICATIONS.map(q => (
                      <button key={q} type="button"
                        onClick={() => setProfileData(p => ({ ...p, qualification: q }))}
                        className={`py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all
                          ${profile.qualification === q
                            ? 'border-[#00897B] bg-[#00897B]/10 text-[#00897B]'
                            : 'border-gray-200 text-[#64748B] hover:border-gray-300'}`}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Your Career Goal</label>
                  <div className="space-y-2">
                    {GOALS.map(g => (
                      <button key={g.value} type="button"
                        onClick={() => setProfileData(p => ({ ...p, career_goal: g.value }))}
                        className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-left border-2 transition-all
                          ${profile.career_goal === g.value
                            ? 'border-[#00897B] bg-[#00897B]/10'
                            : 'border-gray-200 hover:border-gray-300'}`}>
                        <div>
                          <span className="text-sm font-semibold text-[#0A2540]">{g.label}</span>
                          <span className="text-xs text-[#64748B] ml-2">{g.desc}</span>
                        </div>
                        {profile.career_goal === g.value && <div className="w-4 h-4 rounded-full bg-[#00897B] flex items-center justify-center flex-shrink-0"><svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="primary" fullWidth size="lg" onClick={handleProfileNext} loading={loading}>
                  Continue <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Diagnostic */}
          {step === 2 && (
            <div className="fade-up">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>Quick Diagnostic</h1>
                <span className="text-sm text-[#64748B] font-medium">{currentQ + 1} / {DIAGNOSTIC_QUESTIONS.length}</span>
              </div>
              <p className="text-[#64748B] text-sm mb-6">5 questions to personalise your learning path. No pressure — just be honest.</p>

              {/* Progress */}
              <div className="h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-[#00897B] rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }} />
              </div>

              {DIAGNOSTIC_QUESTIONS[currentQ] && (
                <div key={currentQ}>
                  <p className="text-[#0A2540] font-semibold mb-6 leading-relaxed text-base">
                    {DIAGNOSTIC_QUESTIONS[currentQ].question}
                  </p>
                  <div className="space-y-3">
                    {DIAGNOSTIC_QUESTIONS[currentQ].options.map((opt, i) => {
                      const letter = ['a', 'b', 'c', 'd'][i]
                      const selected = answers[DIAGNOSTIC_QUESTIONS[currentQ].id] === letter
                      return (
                        <button key={i} type="button"
                          onClick={() => handleAnswer(DIAGNOSTIC_QUESTIONS[currentQ].id, letter)}
                          className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                            ${selected
                              ? 'border-[#00897B] bg-[#00897B]/10 text-[#00897B]'
                              : 'border-gray-200 hover:border-[#0A2540]/30 text-[#0A2540]'}`}>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${selected ? 'bg-[#00897B] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
                            {letter.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium">{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && (
            <div className="fade-up text-center">
              <div className="w-20 h-20 rounded-full bg-[#00897B]/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0A2540] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your path is ready!</h1>
              <p className="text-[#64748B] text-sm mb-6">You scored <strong>{diagnosticScore()}%</strong> on the diagnostic.</p>

              <div className={`${getPath().color} text-white rounded-2xl p-6 mb-6 text-left`}>
                <div className="text-lg font-bold mb-1">{getPath().label}</div>
                <div className="text-white/80 text-sm">{getPath().desc}</div>
              </div>

              <div className="bg-[#F4A300]/10 rounded-xl p-4 mb-6 text-left">
                <div className="text-sm font-semibold text-[#0A2540] mb-1">🌟 You're a Founding Member!</div>
                <div className="text-xs text-[#64748B]">You're among the first 50 nurses on NursePassport Africa. Your feedback will shape the platform.</div>
              </div>

              <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/dashboard')}>
                Go to My Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

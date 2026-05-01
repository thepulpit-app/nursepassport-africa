import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, PlayCircle, BookOpen, HelpCircle, ChevronRight, Trophy } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const STEPS = [
  { key: 'video',   icon: PlayCircle,  label: 'Watch' },
  { key: 'reading', icon: BookOpen,    label: 'Read' },
  { key: 'quiz',    icon: HelpCircle,  label: 'Quiz' },
]

// Seed quiz questions for CTG Module 1
const SEED_QUIZ = [
  { id: 'q1', question_text: 'What are the four features assessed on a CTG trace?', option_a: 'Baseline rate, variability, accelerations, decelerations', option_b: 'Baseline rate, frequency, duration, recovery', option_c: 'Heart rate, rhythm, waveform, amplitude', option_d: 'Baseline, latency, coupling, decoupling', correct_option: 'a', explanation: 'The four features are: Baseline fetal heart rate, Baseline variability, Accelerations, and Decelerations. These are assessed against NICE (2022) criteria.' },
  { id: 'q2', question_text: 'Normal baseline fetal heart rate according to NICE (2022) is:', option_a: '100-140 bpm', option_b: '110-160 bpm', option_c: '120-170 bpm', option_d: '100-180 bpm', correct_option: 'b', explanation: 'NICE (2022) defines normal baseline FHR as 110-160 bpm. Rates below 110 are bradycardia; above 160 are tachycardia.' },
  { id: 'q3', question_text: 'Normal baseline variability on a CTG is defined as:', option_a: '< 2 bpm', option_b: '2-5 bpm', option_c: '5-25 bpm', option_d: '> 25 bpm', correct_option: 'c', explanation: 'Normal variability is 5-25 bpm. Less than 5 bpm for >90 minutes is abnormal. Greater than 25 bpm (saltatory) is also abnormal.' },
  { id: 'q4', question_text: 'Which NICE (2022) CTG classification requires immediate action?', option_a: 'Normal', option_b: 'Suspicious', option_c: 'Pathological', option_d: 'Non-reactive', correct_option: 'c', explanation: 'A pathological CTG (Category 3) requires immediate review by a senior clinician. Conservative measures and expedited delivery are typically indicated.' },
  { id: 'q5', question_text: 'Accelerations on a CTG are defined as a rise in FHR of at least:', option_a: '10 bpm for at least 10 seconds', option_b: '15 bpm for at least 15 seconds', option_c: '20 bpm for at least 20 seconds', option_d: '10 bpm for at least 30 seconds', correct_option: 'b', explanation: 'An acceleration is defined as a rise of ≥15 bpm lasting ≥15 seconds. In preterm (<32 weeks), ≥10 bpm for ≥10 seconds is used.' },
]

export default function ModulePlayer() {
  const { slug, moduleId } = useParams()
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [module, setModule] = useState(null)
  const [quiz, setQuiz] = useState([])
  const [progress, setProgress] = useState(null)
  const [activeStep, setActiveStep] = useState('video')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadModule() }, [moduleId])

  async function loadModule() {
    const { data: moduleData } = await supabase.from('modules').select('*').eq('id', moduleId).single()
    if (moduleData) {
      setModule(moduleData)
      const { data: quizData } = await supabase.from('quizzes').select('*, quiz_questions(*)').eq('module_id', moduleId).single()
      setQuiz(quizData?.quiz_questions || SEED_QUIZ)
    } else {
      // Seed module for CTG module 1
      setModule({ title: 'CTG Fundamentals', description: 'The four features, NICE classification, and documentation', video_url: null, reading_content: CTG_READING_CONTENT })
      setQuiz(SEED_QUIZ)
    }

    const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', profile.id).eq('module_id', moduleId).single()
    setProgress(progressData)
    if (progressData?.quiz_passed) setQuizSubmitted(true)
    setLoading(false)
  }

  async function markVideoWatched() {
    await upsertProgress({ video_watched: true, status: 'in_progress' })
    setActiveStep('reading')
    toast.success('Video marked as watched!')
  }

  async function markReadingDone() {
    await upsertProgress({ reading_done: true })
    setActiveStep('quiz')
  }

  async function upsertProgress(updates) {
    const existing = await supabase.from('user_progress').select('id').eq('user_id', profile.id).eq('module_id', moduleId).single()
    if (existing.data) {
      await supabase.from('user_progress').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', existing.data.id)
    } else {
      await supabase.from('user_progress').insert({ user_id: profile.id, module_id: moduleId, course_id: null, ...updates })
    }
    setProgress(p => ({ ...p, ...updates }))
  }

  async function submitQuiz() {
    const correct = quiz.filter(q => quizAnswers[q.id] === q.correct_option).length
    const score = Math.round((correct / quiz.length) * 100)
    const passed = score >= 70
    setQuizScore(score)
    setQuizSubmitted(true)

    await upsertProgress({
      quiz_passed: passed,
      quiz_score: score,
      quiz_attempts: (progress?.quiz_attempts || 0) + 1,
      status: passed ? 'completed' : 'in_progress',
      completed_at: passed ? new Date().toISOString() : null,
    })

    if (passed) toast.success('🎉 Module complete! Well done.')
    else toast.error(`Score: ${score}%. You need 70% to pass. Try again!`)
  }

  const allAnswered = quiz.length > 0 && quiz.every(q => quizAnswers[q.id])

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/courses/${slug}`)}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#0A2540] text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        {module && <h1 className="font-bold text-[#0A2540] text-lg truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{module.title}</h1>}
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100">
        {STEPS.map(({ key, icon: Icon, label }) => {
          const done = (key === 'video' && progress?.video_watched) || (key === 'reading' && progress?.reading_done) || (key === 'quiz' && progress?.quiz_passed)
          return (
            <button key={key} onClick={() => setActiveStep(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${activeStep === key ? 'bg-[#0A2540] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0A2540]'}`}>
              {done ? <CheckCircle size={15} className="text-[#00897B]" /> : <Icon size={15} />}
              {label}
              {done && activeStep !== key && <span className="w-1.5 h-1.5 rounded-full bg-[#00897B]" />}
            </button>
          )
        })}
      </div>

      {loading ? <div className="skeleton h-64 rounded-2xl" /> : (
        <>
          {/* Video step */}
          {activeStep === 'video' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {module?.video_url ? (
                <div className="aspect-video bg-black">
                  <video controls className="w-full h-full" src={module.video_url} />
                </div>
              ) : (
                <div className="aspect-video bg-[#0A2540] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlayCircle size={36} className="text-white/60" />
                    </div>
                    <p className="text-white/60 text-sm">Video content coming soon</p>
                    <p className="text-white/40 text-xs mt-1">Your wife is recording the CTG masterclass</p>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h2 className="font-bold text-[#0A2540] mb-2">{module?.title}</h2>
                <p className="text-[#64748B] text-sm mb-5">{module?.description}</p>
                {progress?.video_watched ? (
                  <div className="flex items-center gap-2 text-[#00897B] font-semibold text-sm">
                    <CheckCircle size={16} /> Video watched — move to Reading
                  </div>
                ) : (
                  <Button variant="primary" onClick={markVideoWatched}>
                    Mark as Watched <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Reading step */}
          {activeStep === 'reading' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#0A2540] text-xl mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                📖 {module?.title} — Study Notes
              </h2>
              <div className="prose prose-sm max-w-none text-[#0A2540] leading-relaxed space-y-4 mb-8">
                {(module?.reading_content || CTG_READING_CONTENT).split('\n\n').map((para, i) => (
                  <p key={i} className={para.startsWith('##') ? 'text-lg font-bold text-[#0A2540] mt-6' : para.startsWith('**') ? 'font-semibold' : ''}>{para.replace(/#{1,3} /g, '').replace(/\*\*/g, '')}</p>
                ))}
              </div>
              {progress?.reading_done ? (
                <div className="flex items-center gap-2 text-[#00897B] font-semibold text-sm">
                  <CheckCircle size={16} /> Reading complete — move to Quiz
                </div>
              ) : (
                <Button variant="primary" onClick={markReadingDone}>
                  I've Read This <ChevronRight size={16} />
                </Button>
              )}
            </div>
          )}

          {/* Quiz step */}
          {activeStep === 'quiz' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>Module Assessment</h2>
                <span className="text-sm text-[#64748B]">{quiz.length} questions · Pass: 70%</span>
              </div>

              {quizSubmitted && quizScore !== null && (
                <div className={`rounded-2xl p-6 text-center mb-6 ${quizScore >= 70 ? 'bg-[#00897B]' : 'bg-[#C62828]'}`}>
                  <div className="text-4xl font-extrabold text-white mb-1">{quizScore}%</div>
                  <div className="text-white/80">{quizScore >= 70 ? '✅ Passed! Module complete.' : '❌ Not quite. Review and try again.'}</div>
                  {quizScore >= 70 && (
                    <div className="mt-4">
                      <Trophy size={24} className="text-[#F4A300] mx-auto mb-2" />
                      <p className="text-white text-sm">Module completed! Continue to the next one.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-6">
                {quiz.map((q, qi) => (
                  <div key={q.id} className={`rounded-xl p-5 ${quizSubmitted ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
                    <p className="font-semibold text-[#0A2540] mb-4 text-sm">{qi + 1}. {q.question_text}</p>
                    <div className="space-y-2">
                      {['a', 'b', 'c', 'd'].map((opt) => {
                        const optText = q[`option_${opt}`]
                        const selected = quizAnswers[q.id] === opt
                        const isCorrect = quizSubmitted && opt === q.correct_option
                        const isWrong = quizSubmitted && selected && opt !== q.correct_option
                        return (
                          <button key={opt} disabled={quizSubmitted}
                            onClick={() => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: opt }))}
                            className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-sm
                              ${isCorrect ? 'border-[#00897B] bg-[#00897B]/10 text-[#00897B]' :
                                isWrong ? 'border-[#C62828] bg-[#C62828]/10 text-[#C62828]' :
                                selected ? 'border-[#0A2540] bg-[#0A2540]/10 text-[#0A2540]' :
                                'border-gray-200 text-[#0A2540] hover:border-[#0A2540]/30'}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                              ${isCorrect ? 'bg-[#00897B] text-white' : isWrong ? 'bg-[#C62828] text-white' : selected ? 'bg-[#0A2540] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
                              {opt.toUpperCase()}
                            </span>
                            {optText}
                          </button>
                        )
                      })}
                    </div>
                    {quizSubmitted && q.explanation && (
                      <div className="mt-3 bg-blue-50 rounded-lg p-3">
                        <p className="text-blue-800 text-xs leading-relaxed"><strong>Explanation:</strong> {q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                {!quizSubmitted ? (
                  <Button variant="primary" fullWidth disabled={!allAnswered} onClick={submitQuiz}>
                    Submit Assessment
                  </Button>
                ) : quizScore < 70 ? (
                  <Button variant="outline" fullWidth onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null) }}>
                    Try Again
                  </Button>
                ) : (
                  <Button variant="primary" fullWidth onClick={() => navigate(`/courses/${slug}`)}>
                    Back to Course <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  )
}

const CTG_READING_CONTENT = `## The Four Features of CTG Interpretation

Understanding CTG interpretation is a fundamental clinical skill for any nurse or midwife working in obstetrics. This module covers the four features you must assess on every CTG trace.

## 1. Baseline Fetal Heart Rate

The baseline FHR is the mean level of the fetal heart rate when this is stable, excluding accelerations and decelerations. It is assessed over a minimum of 2 minutes in any 10-minute segment.

**Normal (NICE 2022):** 110–160 bpm
**Tachycardia:** > 160 bpm (if persistent and unexplained, escalate)
**Bradycardia:** < 110 bpm (always requires immediate assessment)

## 2. Baseline Variability

Variability refers to minor fluctuations in the baseline FHR occurring at a rate of 2 cycles per minute or more. It reflects the interaction between the sympathetic and parasympathetic nervous systems.

**Normal:** 5–25 bpm
**Reduced (non-reassuring):** < 5 bpm for 90+ minutes
**Increased/Saltatory:** > 25 bpm for > 10 minutes

Reduced variability in the presence of decelerations is particularly concerning and requires immediate escalation.

## 3. Accelerations

Accelerations are transient increases in FHR of ≥15 bpm above the baseline, lasting ≥15 seconds. The presence of accelerations is generally reassuring.

The absence of accelerations for more than 40 minutes (non-reactive trace) should trigger further assessment and possible escalation.

## 4. Decelerations

Decelerations are transient episodes of slowing of the FHR below the baseline of more than 15 bpm and lasting more than 15 seconds.

**Early decelerations:** Uniform, coincide with contractions — usually benign (head compression)
**Late decelerations:** Uniform, begin after contraction peak — indicate uteroplacental insufficiency (ALWAYS escalate)
**Variable decelerations:** Abrupt onset, vary in shape — cord compression
**Prolonged decelerations:** Lasting > 2–3 minutes — immediate escalation required

## NICE (2022) Classification

**Normal/Reassuring:** All four features are normal
**Suspicious/Non-reassuring:** One feature is non-reassuring
**Pathological:** Two or more non-reassuring features, OR one abnormal feature

A pathological CTG requires immediate senior review and urgent action to identify and correct the cause.`

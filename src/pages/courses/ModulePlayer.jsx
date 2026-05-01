import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, PlayCircle, BookOpen, HelpCircle, CheckCircle, ChevronRight, Trophy } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'

const STEPS = [
  { key: 'video', icon: PlayCircle, label: 'Watch' },
  { key: 'reading', icon: BookOpen, label: 'Read' },
  { key: 'quiz', icon: HelpCircle, label: 'Quiz' },
]

const SEED_QUIZ = [
  { id: 'q1', question_text: 'What are the four features assessed on a CTG trace?', option_a: 'Baseline rate, variability, accelerations, decelerations', option_b: 'Baseline rate, frequency, duration, recovery', option_c: 'Heart rate, rhythm, waveform, amplitude', option_d: 'Baseline, latency, coupling, decoupling', correct_option: 'a', explanation: 'The four features are: Baseline fetal heart rate, Baseline variability, Accelerations, and Decelerations. These are assessed against NICE (2022) criteria.' },
  { id: 'q2', question_text: 'Normal baseline fetal heart rate according to NICE (2022) is:', option_a: '100-140 bpm', option_b: '110-160 bpm', option_c: '120-170 bpm', option_d: '100-180 bpm', correct_option: 'b', explanation: 'NICE (2022) defines normal baseline FHR as 110-160 bpm. Rates below 110 are bradycardia; above 160 are tachycardia.' },
  { id: 'q3', question_text: 'Normal baseline variability on a CTG is defined as:', option_a: '< 2 bpm', option_b: '2-5 bpm', option_c: '5-25 bpm', option_d: '> 25 bpm', correct_option: 'c', explanation: 'Normal variability is 5-25 bpm. Less than 5 bpm for >90 minutes is abnormal. Greater than 25 bpm (saltatory) is also abnormal.' },
  { id: 'q4', question_text: 'Which NICE (2022) CTG classification requires immediate action?', option_a: 'Normal', option_b: 'Suspicious', option_c: 'Pathological', option_d: 'Non-reactive', correct_option: 'c', explanation: 'A pathological CTG (Category 3) requires immediate review by a senior clinician. Conservative measures and expedited delivery are typically indicated.' },
  { id: 'q5', question_text: 'Accelerations on a CTG are defined as a rise in FHR of at least:', option_a: '10 bpm for at least 10 seconds', option_b: '15 bpm for at least 15 seconds', option_c: '20 bpm for at least 20 seconds', option_d: '10 bpm for at least 30 seconds', correct_option: 'b', explanation: 'An acceleration is defined as a rise of ≥15 bpm lasting ≥15 seconds. In preterm (<32 weeks), ≥10 bpm for ≥10 seconds is used.' },
]

const CTG_READING = `The four features of CTG interpretation are the foundation of every assessment you will ever make in labour ward. Master these and everything else follows.

## 1. Baseline Fetal Heart Rate

The baseline FHR is the mean level of the fetal heart rate when stable, excluding accelerations and decelerations. Assessed over a minimum of 2 minutes.

Normal (NICE 2022): 110–160 bpm
Tachycardia: > 160 bpm — if persistent and unexplained, escalate
Bradycardia: < 110 bpm — always requires immediate assessment

## 2. Baseline Variability

Variability refers to minor fluctuations in the baseline FHR at a rate of 2 cycles per minute or more. It reflects the interaction between the sympathetic and parasympathetic nervous systems — a healthy nervous system produces a "wiggly" trace.

Normal: 5–25 bpm
Reduced (non-reassuring): < 5 bpm for 90+ minutes
Increased/Saltatory: > 25 bpm for > 10 minutes

Reduced variability in the presence of decelerations is particularly concerning and requires immediate escalation.

## 3. Accelerations

Accelerations are transient increases in FHR of ≥15 bpm above the baseline, lasting ≥15 seconds. Their presence is generally reassuring — it tells you the fetal nervous system is responding normally.

The absence of accelerations for more than 40 minutes (non-reactive trace) should trigger further assessment.

## 4. Decelerations

Decelerations are transient episodes of slowing of the FHR below the baseline of more than 15 bpm lasting more than 15 seconds.

Early decelerations: Coincide with contractions — usually benign (head compression)
Late decelerations: Begin AFTER the contraction peak — indicate uteroplacental insufficiency. ALWAYS escalate.
Variable decelerations: Abrupt onset, vary in shape — cord compression
Prolonged: Lasting > 2–3 minutes — immediate escalation required

## NICE (2022) Classification

Normal/Reassuring: All four features are normal
Suspicious/Non-reassuring: One feature is non-reassuring
Pathological: Two or more non-reassuring features, OR one abnormal feature

A pathological CTG requires immediate senior review. Do not wait.`

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
      setModule({ title: 'CTG Fundamentals', description: 'The four features, NICE classification, and documentation', video_url: null, reading_content: CTG_READING })
      setQuiz(SEED_QUIZ)
    }
    const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', profile.id).eq('module_id', moduleId).single()
    setProgress(progressData)
    if (progressData?.quiz_passed) { setQuizSubmitted(true); setQuizScore(progressData.quiz_score) }
    setLoading(false)
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

  async function markVideoWatched() {
    await upsertProgress({ video_watched: true, status: 'in_progress' })
    setActiveStep('reading')
    toast.success('Video marked as watched!')
  }

  async function markReadingDone() {
    await upsertProgress({ reading_done: true })
    setActiveStep('quiz')
  }

  async function submitQuiz() {
    const correct = quiz.filter(q => quizAnswers[q.id] === q.correct_option).length
    const score = Math.round((correct / quiz.length) * 100)
    const passed = score >= 70
    setQuizScore(score)
    setQuizSubmitted(true)
    await upsertProgress({ quiz_passed: passed, quiz_score: score, quiz_attempts: (progress?.quiz_attempts || 0) + 1, status: passed ? 'completed' : 'in_progress', completed_at: passed ? new Date().toISOString() : null })
    if (passed) toast.success('🎉 Module complete!')
    else toast.error(`${score}% — need 70% to pass. Try again!`)
  }

  const stepDone = (key) => (key === 'video' && progress?.video_watched) || (key === 'reading' && progress?.reading_done) || (key === 'quiz' && progress?.quiz_passed)

  return (
    <AppShell>
      <style>{`
        .step-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 8px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
        .quiz-option { width: 100%; text-align: left; display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px; border: 1.5px solid #E2E8F0; background: white; cursor: pointer; transition: all 0.2s; margin-bottom: 8px; }
        .quiz-option:hover { border-color: #6366F1; }
        .option-letter { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
        .reading-content { line-height: 1.7; color: #374151; font-size: 14px; }
        .reading-content h2 { font-size: 16px; font-weight: 800; color: #0A2540; margin: 24px 0 8px; }
      `}</style>

      {/* Back */}
      <button onClick={() => navigate(`/courses/${slug}`)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '16px', padding: 0 }}>
        <ArrowLeft size={16} /> Back to Course
      </button>

      {/* Module title */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>{module?.title || '...'}</h1>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>{module?.description}</p>
      </div>

      {/* Step tabs */}
      <div style={{ display: 'flex', gap: '6px', background: 'white', borderRadius: '16px', padding: '6px', border: '1px solid #F1F5F9', marginBottom: '20px' }}>
        {STEPS.map(({ key, icon: Icon, label }) => (
          <button key={key} className="step-tab"
            style={{ background: activeStep === key ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'transparent', color: activeStep === key ? 'white' : '#94A3B8' }}
            onClick={() => setActiveStep(key)}>
            {stepDone(key) ? <CheckCircle size={14} color={activeStep === key ? 'white' : '#22C55E'} /> : <Icon size={14} />}
            {label}
            {stepDone(key) && activeStep !== key && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />}
          </button>
        ))}
      </div>

      {loading ? <div style={{ height: '300px', background: '#F1F5F9', borderRadius: '20px' }} /> : (
        <>
          {/* VIDEO */}
          {activeStep === 'video' && (
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
              {module?.video_url ? (
                <div style={{ aspectRatio: '16/9', background: '#000' }}>
                  <video controls style={{ width: '100%', height: '100%' }} src={module.video_url} />
                </div>
              ) : (
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <PlayCircle size={32} color="rgba(255,255,255,0.5)" />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Video coming soon</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: '4px 0 0' }}>Dr. Ajijola is recording the masterclass</p>
                </div>
              )}
              <div style={{ padding: '20px' }}>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px' }}>
                  Watch the video lesson, then proceed to the reading material to reinforce your learning.
                </p>
                {progress?.video_watched ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22C55E', fontWeight: '700', fontSize: '14px' }}>
                    <CheckCircle size={16} /> Watched — move to Reading
                  </div>
                ) : (
                  <button onClick={markVideoWatched}
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Mark as Watched <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* READING */}
          {activeStep === 'reading' && (
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: '36px', height: '36px', background: '#EEF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} color="#6366F1" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>Study Notes</div>
                  <div style={{ color: '#94A3B8', fontSize: '12px' }}>Read carefully before taking the quiz</div>
                </div>
              </div>
              <div className="reading-content">
                {(module?.reading_content || CTG_READING).split('\n\n').map((para, i) => {
                  if (para.startsWith('## ')) return <h2 key={i}>{para.replace('## ', '')}</h2>
                  if (para.startsWith('# ')) return <h2 key={i} style={{ fontSize: '18px', marginTop: '8px' }}>{para.replace('# ', '')}</h2>
                  return <p key={i} style={{ margin: '0 0 12px' }}>{para}</p>
                })}
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                {progress?.reading_done ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22C55E', fontWeight: '700', fontSize: '14px' }}>
                    <CheckCircle size={16} /> Reading complete — take the quiz
                  </div>
                ) : (
                  <button onClick={markReadingDone}
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    I've Read This <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* QUIZ */}
          {activeStep === 'quiz' && (
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 2px' }}>Module Assessment</h2>
                  <div style={{ color: '#94A3B8', fontSize: '12px' }}>{quiz.length} questions · Pass mark: 70%</div>
                </div>
                {quizSubmitted && quizScore !== null && (
                  <div style={{ background: quizScore >= 70 ? '#F0FDF4' : '#FFF1F2', border: `1px solid ${quizScore >= 70 ? '#BBF7D0' : '#FECDD3'}`, borderRadius: '12px', padding: '8px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: quizScore >= 70 ? '#22C55E' : '#F43F5E' }}>{quizScore}%</div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: quizScore >= 70 ? '#22C55E' : '#F43F5E' }}>{quizScore >= 70 ? 'PASSED' : 'RETRY'}</div>
                  </div>
                )}
              </div>

              {quizSubmitted && quizScore >= 70 && (
                <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                  <Trophy size={32} color="#F59E0B" style={{ marginBottom: '8px' }} />
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Module Complete! 🎉</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>You scored {quizScore}% — well done!</div>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                {quiz.map((q, qi) => (
                  <div key={q.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: qi < quiz.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <p style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px', margin: '0 0 12px', lineHeight: '1.4' }}>
                      {qi + 1}. {q.question_text}
                    </p>
                    {['a', 'b', 'c', 'd'].map((opt) => {
                      const text = q[`option_${opt}`]
                      const selected = quizAnswers[q.id] === opt
                      const isCorrect = quizSubmitted && opt === q.correct_option
                      const isWrong = quizSubmitted && selected && opt !== q.correct_option
                      return (
                        <button key={opt} className="quiz-option" disabled={quizSubmitted}
                          onClick={() => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: opt }))}
                          style={{ borderColor: isCorrect ? '#22C55E' : isWrong ? '#F43F5E' : selected ? '#6366F1' : '#E2E8F0', background: isCorrect ? '#F0FDF4' : isWrong ? '#FFF1F2' : selected ? '#EEF2FF' : 'white' }}>
                          <div className="option-letter" style={{ background: isCorrect ? '#22C55E' : isWrong ? '#F43F5E' : selected ? '#6366F1' : '#F8FAFC', color: (isCorrect || isWrong || selected) ? 'white' : '#94A3B8' }}>
                            {opt.toUpperCase()}
                          </div>
                          <span style={{ fontSize: '13px', color: '#0A2540', fontWeight: selected ? '600' : '400' }}>{text}</span>
                        </button>
                      )
                    })}
                    {quizSubmitted && q.explanation && (
                      <div style={{ background: '#EEF2FF', borderRadius: '10px', padding: '12px', marginTop: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#4F46E5', margin: 0, lineHeight: '1.5' }}><strong>Explanation:</strong> {q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button disabled={!quiz.every(q => quizAnswers[q.id])}
                  onClick={submitQuiz}
                  style={{ width: '100%', background: quiz.every(q => quizAnswers[q.id]) ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F1F5F9', color: quiz.every(q => quizAnswers[q.id]) ? 'white' : '#94A3B8', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: quiz.every(q => quizAnswers[q.id]) ? 'pointer' : 'not-allowed' }}>
                  Submit Assessment
                </button>
              ) : quizScore < 70 ? (
                <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null) }}
                  style={{ width: '100%', background: '#FFF1F2', color: '#F43F5E', border: '1.5px solid #FECDD3', borderRadius: '12px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                  Try Again
                </button>
              ) : (
                <button onClick={() => navigate(`/courses/${slug}`)}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Back to Course <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </AppShell>
  )
}

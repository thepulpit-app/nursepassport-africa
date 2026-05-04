import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Lock, RotateCcw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'

const TRACKS = [
  { key: 'nclex', flag: '🇺🇸', label: 'NCLEX-RN', sub: 'USA & Canada', color: '#4F46E5', bg: '#EEF2FF', tier: 'nurse' },
  { key: 'nmc_cbt', flag: '🇬🇧', label: 'NMC CBT', sub: 'United Kingdom', color: '#F43F5E', bg: '#FFF1F2', tier: 'nurse' },
  { key: 'haad', flag: '🇦🇪', label: 'HAAD/DHA', sub: 'UAE', color: '#F59E0B', bg: '#FFFBEB', tier: 'passport' },
  { key: 'nmbn', flag: '🇳🇬', label: 'NMBN', sub: 'Nigeria', color: '#22C55E', bg: '#F0FDF4', tier: 'nurse' },
]

const SEED_QUESTIONS = {
  nclex: [
    { id: 'n1', question_text: 'A nurse is caring for a client with increased intracranial pressure. Which position should the nurse maintain?', option_a: 'Trendelenburg position', option_b: 'Head of bed elevated 30-45 degrees', option_c: 'Flat supine position', option_d: 'Left lateral position', correct_option: 'b', explanation: 'Elevating the head of bed 30-45 degrees promotes venous drainage from the brain, reducing ICP.' },
    { id: 'n2', question_text: 'A client is prescribed digoxin 0.125mg daily. The apical pulse is 52 bpm. What should the nurse do?', option_a: 'Administer the medication as prescribed', option_b: 'Hold the medication and notify the physician', option_c: 'Administer half the dose', option_d: 'Administer and monitor closely', correct_option: 'b', explanation: 'Digoxin should be withheld if apical pulse is below 60 bpm. Bradycardia is a sign of digoxin toxicity.' },
    { id: 'n3', question_text: 'Which food should a client on warfarin therapy avoid in large amounts?', option_a: 'Citrus fruits', option_b: 'Leafy green vegetables', option_c: 'Dairy products', option_d: 'Red meat', correct_option: 'b', explanation: 'Leafy green vegetables are high in Vitamin K, which antagonises warfarin.' },
    { id: 'n4', question_text: 'Which postoperative finding requires immediate nursing intervention?', option_a: 'Blood pressure 118/76 mmHg', option_b: 'Oxygen saturation 99%', option_c: 'Urine output 20mL over 2 hours', option_d: 'Pain score of 4/10', correct_option: 'c', explanation: 'Urine output less than 30mL/hour indicates oliguria requiring immediate intervention.' },
    { id: 'n5', question_text: 'What is the preferred IM injection site for large volume injections in adults?', option_a: 'Deltoid muscle', option_b: 'Vastus lateralis', option_c: 'Ventrogluteal site', option_d: 'Dorsogluteal site', correct_option: 'c', explanation: 'The ventrogluteal site is preferred — free from major blood vessels and nerves.' },
  ],
  nmc_cbt: [
    { id: 'uk1', question_text: 'A patient states they have a new allergy before medication. What should the nurse do first?', option_a: 'Administer as previously prescribed', option_b: 'Document the allergy and withhold pending review', option_c: 'Ask another nurse to administer it', option_d: 'Give a reduced dose', correct_option: 'b', explanation: 'Document the allergy, withhold medication, and contact the prescriber.' },
    { id: 'uk2', question_text: 'Under the NMC Code, a nurse must always:', option_a: 'Follow senior nurses without question', option_b: 'Prioritise people, practise effectively, preserve safety, and promote professionalism', option_c: 'Follow ward protocols above patient preferences', option_d: 'Report only serious incidents', correct_option: 'b', explanation: 'The four themes of the NMC Code: Prioritise people, Practise effectively, Preserve safety, Promote professionalism.' },
    { id: 'uk3', question_text: 'A competent patient refuses a life-saving transfusion. The nurse should:', option_a: 'Administer to save the life', option_b: 'Contact next of kin to override', option_c: 'Respect the decision and document clearly', option_d: 'Ask the doctor to convince the patient', correct_option: 'c', explanation: 'A competent adult has the absolute right to refuse treatment.' },
    { id: 'uk4', question_text: 'WHO hand hygiene with soap and water minimum duration:', option_a: '10-15 seconds', option_b: '20-30 seconds', option_c: '40-60 seconds', option_d: '2 minutes', correct_option: 'c', explanation: 'WHO recommends 40-60 seconds with soap and water.' },
    { id: 'uk5', question_text: 'Required dose 500mg, tablets 250mg each. How many tablets?', option_a: '1', option_b: '1.5', option_c: '2', option_d: '2.5', correct_option: 'c', explanation: '500 divided by 250 = 2 tablets.' },
  ],
  haad: [
    { id: 'h1', question_text: 'Which authority regulates healthcare in Abu Dhabi?', option_a: 'DHA', option_b: 'HAAD', option_c: 'MOHAP', option_d: 'JCI', correct_option: 'b', explanation: 'HAAD regulates Abu Dhabi. DHA regulates Dubai.' },
    { id: 'h2', question_text: 'Classic MI presentation priority action?', option_a: 'Oral pain relief', option_b: '12-lead ECG and emergency team', option_c: 'Reassure and monitor', option_d: 'Position flat', correct_option: 'b', explanation: 'Immediate ECG and emergency team activation is critical in suspected MI.' },
    { id: 'h3', question_text: 'Diabetic Muslim refuses insulin during Ramadan. Nurse should:', option_a: 'Withhold insulin completely', option_b: 'Consult physician and religious scholars', option_c: 'Force injection', option_d: 'Document and take no action', correct_option: 'b', explanation: 'Multidisciplinary approach with cultural sensitivity.' },
    { id: 'h4', question_text: 'UAE informed consent must be obtained for:', option_a: 'Surgery only', option_b: 'All invasive procedures and treatments', option_c: 'Only when patient requests', option_d: 'By administrator only', correct_option: 'b', explanation: 'UAE law requires informed consent for all invasive procedures.' },
    { id: 'h5', question_text: 'DHA exam is required to practice in:', option_a: 'Abu Dhabi', option_b: 'Sharjah', option_c: 'Dubai', option_d: 'Ajman', correct_option: 'c', explanation: 'DHA license is required for Dubai.' },
  ],
  nmbn: [
    { id: 'ng1', question_text: 'MSS was designed to:', option_a: 'Train specialist nurses', option_b: 'Deploy midwives to rural PHCs to reduce maternal mortality', option_c: 'Provide scholarships abroad', option_d: 'Regulate private practice', correct_option: 'b', explanation: 'MSS deployed midwives to rural primary health centres.' },
    { id: 'ng2', question_text: 'Recommended birth-to-first-breastfeed interval:', option_a: '30 minutes', option_b: '1 hour', option_c: '2 hours', option_d: '6 hours', correct_option: 'b', explanation: 'WHO and Nigeria recommend breastfeeding within 1 hour of birth.' },
    { id: 'ng3', question_text: 'NHIS established under:', option_a: 'National Health Act 2014', option_b: 'NHIS Act Cap N42 LFN 2004', option_c: 'Medical Practitioners Act', option_d: 'Nursing Act', correct_option: 'b', explanation: 'NHIS Act Cap N42 LFN 2004.' },
    { id: 'ng4', question_text: 'NMBN is responsible for:', option_a: 'Licensing doctors', option_b: 'Regulating nursing and midwifery in Nigeria', option_c: 'Managing hospitals', option_d: 'Distributing pharmaceuticals', correct_option: 'b', explanation: 'NMCN/NMBN regulates nursing and midwifery practice in Nigeria.' },
    { id: 'ng5', question_text: 'Primary malaria prevention in Nigeria:', option_a: 'Vaccination only', option_b: 'ITNs and IRS', option_c: 'Antibiotics prophylaxis', option_d: 'Water purification only', correct_option: 'b', explanation: 'ITNs and IRS are primary malaria prevention interventions.' },
  ],
}

const FREE_LIMIT = 5

const PASSPORT_FEATURES = [
  { emoji: '⏱️', label: 'Timed Mock Exams', sub: '75 or 145 questions — real NCLEX/NMC format', path: '/mock-exam?track=nclex' },
  { emoji: '📊', label: 'Performance Analytics', sub: 'Track weak areas by category', path: '/analytics' },
  { emoji: '🎯', label: 'Weak Area Identification', sub: 'AI-powered study recommendations', path: '/analytics' },
  { emoji: '🏥', label: 'OSCE Questions', sub: 'Clinical skills and communication stations', path: '/osce' },
]

export default function QuestionBank() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [activeTrack, setActiveTrack] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sessionScore, setSessionScore] = useState(null)
  const [loading, setLoading] = useState(false)

  async function startTrack(track) {
    if (track.tier === 'passport' && tier !== 'passport') {
      toast.error('Passport plan required')
      navigate('/billing')
      return
    }
    setLoading(true)
    setActiveTrack(track)
    setCurrentIndex(0)
    setAnswers({})
    setSubmitted(false)
    setSessionScore(null)
    const { data } = await supabase.from('question_banks').select('*').eq('track', track.key).eq('is_published', true).limit(tier === 'free' ? FREE_LIMIT : 50)
    const questionList = data?.length ? data : SEED_QUESTIONS[track.key] || []
    const limited = tier === 'free' ? questionList.slice(0, FREE_LIMIT) : questionList
    setQuestions(limited)
    setLoading(false)
  }

  function handleSubmit() {
    const correct = questions.filter(q => answers[q.id] === q.correct_option).length
    setSessionScore(Math.round((correct / questions.length) * 100))
    setSubmitted(true)
  }

  const currentQ = questions[currentIndex]
  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id])

  if (!activeTrack) {
    return (
      <AppShell>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Question Banks</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Practice exam questions for your target country</p>
        </div>

        {tier === 'free' && (
          <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>Free plan — {FREE_LIMIT} questions per track</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>Upgrade to Nurse for full access</div>
            </div>
            <button onClick={() => navigate('/billing')} style={{ background: '#F4A300', color: '#0A2540', border: 'none', borderRadius: '8px', padding: '6px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
              Upgrade
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {TRACKS.map(track => {
            const locked = track.tier === 'passport' && tier !== 'passport'
            return (
              <div key={track.key} onClick={() => !locked && startTrack(track)}
                style={{ background: 'white', borderRadius: '20px', border: `2px solid ${locked ? '#F1F5F9' : track.bg}`, padding: '20px', cursor: locked ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: locked ? 0.7 : 1 }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{track.flag}</div>
                <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '16px', marginBottom: '2px' }}>{track.label}</div>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '12px' }}>{track.sub}</div>
                {locked ? (
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', background: '#FFF7ED', color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={10} /> Passport Only
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', background: track.bg, color: track.color }}>
                    Start Practice →
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>✈️ Passport Features</div>
            {tier !== 'passport' && (
              <button onClick={() => navigate('/billing')} style={{ background: '#F59E0B', color: '#0A2540', border: 'none', borderRadius: '8px', padding: '5px 12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                Upgrade
              </button>
            )}
          </div>
          {PASSPORT_FEATURES.map((item, i) => (
            <div key={i} onClick={() => tier === 'passport' ? navigate(item.path) : navigate('/billing')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < PASSPORT_FEATURES.length - 1 ? '1px solid #F8FAFC' : 'none', opacity: tier !== 'passport' ? 0.6 : 1, cursor: 'pointer' }}>
              <div style={{ fontSize: '22px', width: '36px', textAlign: 'center' }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{item.label}</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>{item.sub}</div>
              </div>
              {tier !== 'passport' ? (
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', background: '#FFF7ED', color: '#F59E0B' }}>Passport</span>
              ) : (
                <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '700' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <style>{`.q-opt { width:100%; display:flex; align-items:center; gap:12px; padding:14px; border-radius:12px; border:1.5px solid #E2E8F0; background:white; cursor:pointer; transition:all 0.2s; margin-bottom:8px; text-align:left; }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTrack(null)} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 14px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', color: '#64748B' }}>← Back</button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{activeTrack.flag} {activeTrack.label}</h1>
          <div style={{ color: '#94A3B8', fontSize: '12px' }}>{questions.length} questions · {activeTrack.sub}</div>
        </div>
      </div>

      {loading ? <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '20px' }} /> :
      submitted ? (
        <div>
          <div style={{ background: sessionScore >= 70 ? 'linear-gradient(135deg,#22C55E,#16A34A)' : 'linear-gradient(135deg,#F43F5E,#DC2626)', borderRadius: '20px', padding: '28px', textAlign: 'center', marginBottom: '20px', color: 'white' }}>
            <div style={{ fontSize: '56px', fontWeight: '900', lineHeight: 1 }}>{sessionScore}%</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>{sessionScore >= 80 ? '🏆 Excellent!' : sessionScore >= 70 ? '✅ Passed' : '📚 Keep Practicing'}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>{questions.filter(q => answers[q.id] === q.correct_option).length} of {questions.length} correct</div>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>Review Answers</h2>
          {questions.map((q, i) => {
            const correct = answers[q.id] === q.correct_option
            return (
              <div key={q.id} style={{ background: 'white', borderRadius: '16px', border: `1px solid ${correct ? '#BBF7D0' : '#FECDD3'}`, padding: '16px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
                  {correct ? <CheckCircle size={18} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} /> : <XCircle size={18} color="#F43F5E" style={{ flexShrink: 0, marginTop: '2px' }} />}
                  <p style={{ fontWeight: '600', color: '#0A2540', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>{i + 1}. {q.question_text}</p>
                </div>
                <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700' }}>✓ Correct: </span>
                  <span style={{ fontSize: '13px', color: '#0A2540' }}>{q[`option_${q.correct_option}`]}</span>
                </div>
                {q.explanation && (
                  <div style={{ background: '#EEF2FF', borderRadius: '8px', padding: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#4F46E5', fontWeight: '700' }}>💡 </span>
                    <span style={{ fontSize: '13px', color: '#0A2540' }}>{q.explanation}</span>
                  </div>
                )}
              </div>
            )
          })}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={() => { setAnswers({}); setSubmitted(false); setSessionScore(null); setCurrentIndex(0) }}
              style={{ flex: 1, padding: '13px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <RotateCcw size={14} /> Try Again
            </button>
            <button onClick={() => setActiveTrack(null)}
              style={{ flex: 1, padding: '13px', background: `linear-gradient(135deg, ${activeTrack.color}, ${activeTrack.color}CC)`, border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', color: 'white' }}>
              Change Track
            </button>
          </div>

          {tier === 'free' && (
            <div style={{ background: 'linear-gradient(135deg,#0A2540,#1E3A5F)', borderRadius: '16px', padding: '20px', marginTop: '16px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '6px' }}>Want more questions?</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '14px' }}>Upgrade to Nurse for 50 questions per session</div>
              <button onClick={() => navigate('/billing')} style={{ background: '#F4A300', color: '#0A2540', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540' }}>Question {currentIndex + 1} of {questions.length}</span>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>{Object.keys(answers).length} answered</span>
          </div>
          <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '6px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ background: activeTrack.color, height: '100%', width: `${((currentIndex + 1) / questions.length) * 100}%`, borderRadius: '99px', transition: 'width 0.3s' }} />
          </div>

          {currentQ && (
            <>
              <p style={{ fontWeight: '700', color: '#0A2540', fontSize: '15px', lineHeight: '1.5', marginBottom: '16px' }}>{currentQ.question_text}</p>
              {['a', 'b', 'c', 'd'].map(opt => {
                const selected = answers[currentQ.id] === opt
                return (
                  <button key={opt} className="q-opt"
                    onClick={() => setAnswers(a => ({ ...a, [currentQ.id]: opt }))}
                    style={{ borderColor: selected ? activeTrack.color : '#E2E8F0', background: selected ? activeTrack.bg : 'white' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0, background: selected ? activeTrack.color : '#F8FAFC', color: selected ? 'white' : '#94A3B8' }}>
                      {opt.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '14px', color: selected ? activeTrack.color : '#0A2540', fontWeight: selected ? '600' : '400' }}>{currentQ[`option_${opt}`]}</span>
                  </button>
                )
              })}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}
                  style={{ padding: '10px 20px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', color: '#64748B', opacity: currentIndex === 0 ? 0.5 : 1 }}>
                  ← Previous
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button onClick={() => setCurrentIndex(i => i + 1)}
                    style={{ padding: '10px 20px', background: activeTrack.color, border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: 'white' }}>
                    Next →
                  </button>
                ) : (
                  <button disabled={!allAnswered} onClick={handleSubmit}
                    style={{ padding: '10px 20px', background: allAnswered ? '#22C55E' : '#F1F5F9', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: allAnswered ? 'pointer' : 'not-allowed', color: allAnswered ? 'white' : '#94A3B8' }}>
                    Submit All
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px', justifyContent: 'center' }}>
                {questions.map((q, i) => (
                  <button key={i} onClick={() => setCurrentIndex(i)}
                    style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', background: i === currentIndex ? activeTrack.color : answers[q.id] ? '#F0FDF4' : '#F1F5F9', color: i === currentIndex ? 'white' : answers[q.id] ? '#22C55E' : '#94A3B8' }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </AppShell>
  )
}
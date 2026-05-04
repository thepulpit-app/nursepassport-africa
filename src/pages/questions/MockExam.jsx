import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, RotateCcw, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'

const TRACK_INFO = {
  nclex: { label: 'NCLEX-RN', flag: '🇺🇸', color: '#4F46E5', bg: '#EEF2FF', modes: [{ label: '75 Questions', count: 75, time: 90 }, { label: '145 Questions', count: 145, time: 180 }] },
  nmc_cbt: { label: 'NMC CBT', flag: '🇬🇧', color: '#F43F5E', bg: '#FFF1F2', modes: [{ label: '80 Questions', count: 80, time: 120 }, { label: '120 Questions', count: 120, time: 150 }] },
  haad: { label: 'HAAD/DHA', flag: '🇦🇪', color: '#F59E0B', bg: '#FFFBEB', modes: [{ label: '100 Questions', count: 100, time: 120 }, { label: '150 Questions', count: 150, time: 180 }] },
  nmbn: { label: 'NMBN', flag: '🇳🇬', color: '#22C55E', bg: '#F0FDF4', modes: [{ label: '60 Questions', count: 60, time: 90 }, { label: '100 Questions', count: 100, time: 120 }] },
}

// Extended seed questions for mock exams
const MOCK_QUESTIONS = {
  nclex: [
    { id: 'mn1', question_text: 'A nurse is caring for a client with increased intracranial pressure. Which position should the nurse maintain?', option_a: 'Trendelenburg position', option_b: 'Head of bed elevated 30-45 degrees', option_c: 'Flat supine position', option_d: 'Left lateral position', correct_option: 'b', category: 'Physiological Adaptation', explanation: 'Elevating HOB 30-45 degrees promotes venous drainage, reducing ICP.' },
    { id: 'mn2', question_text: 'A client prescribed digoxin has an apical pulse of 52 bpm. What should the nurse do?', option_a: 'Administer as prescribed', option_b: 'Hold and notify physician', option_c: 'Give half the dose', option_d: 'Administer and monitor', correct_option: 'b', category: 'Pharmacology', explanation: 'Hold digoxin if pulse < 60 bpm. Bradycardia indicates toxicity.' },
    { id: 'mn3', question_text: 'Which food should a client on warfarin avoid in large amounts?', option_a: 'Citrus fruits', option_b: 'Leafy green vegetables', option_c: 'Dairy products', option_d: 'Red meat', correct_option: 'b', category: 'Pharmacology', explanation: 'Vitamin K in leafy greens antagonises warfarin.' },
    { id: 'mn4', question_text: 'Urine output of 20mL over 2 hours in a postoperative patient requires:', option_a: 'Routine monitoring', option_b: 'Increase oral fluids', option_c: 'Immediate intervention', option_d: 'Reassessment in 1 hour', correct_option: 'c', category: 'Reduction of Risk', explanation: 'Output < 30mL/hr indicates oliguria requiring immediate action.' },
    { id: 'mn5', question_text: 'Preferred IM injection site for large volume in adults:', option_a: 'Deltoid', option_b: 'Vastus lateralis', option_c: 'Ventrogluteal', option_d: 'Dorsogluteal', correct_option: 'c', category: 'Basic Care', explanation: 'Ventrogluteal is preferred — large muscle, no major vessels or nerves.' },
    { id: 'mn6', question_text: 'A client with COPD has an SpO2 of 88%. What oxygen delivery is appropriate?', option_a: 'Non-rebreather mask at 15L/min', option_b: 'Venturi mask at 24-28%', option_c: 'Simple face mask at 10L/min', option_d: 'No oxygen needed', correct_option: 'b', category: 'Physiological Adaptation', explanation: 'COPD patients rely on hypoxic drive. Controlled O2 via Venturi mask prevents CO2 retention.' },
    { id: 'mn7', question_text: 'A client returns from surgery with a Jackson-Pratt drain. The nurse notices the drain is full. The priority action is:', option_a: 'Document and continue monitoring', option_b: 'Empty the drain and record output', option_c: 'Notify the surgeon immediately', option_d: 'Remove the drain', correct_option: 'b', category: 'Basic Care', explanation: 'JP drains should be emptied when full and output documented. Excessive output may warrant physician notification.' },
    { id: 'mn8', question_text: 'Which assessment finding indicates compartment syndrome?', option_a: 'Mild swelling at cast site', option_b: 'Pain relieved with analgesics', option_c: 'Pain unrelieved by analgesics and paresthesias', option_d: 'Redness at incision site', correct_option: 'c', category: 'Physiological Adaptation', explanation: 'Compartment syndrome presents with pain unrelieved by analgesics, paresthesias, pallor, and pulselessness.' },
    { id: 'mn9', question_text: 'A client with a sodium level of 125 mEq/L will likely exhibit:', option_a: 'Hyperreflexia and seizures', option_b: 'Lethargy, confusion and headache', option_c: 'Polyuria and polydipsia', option_d: 'Bradycardia and hypertension', correct_option: 'b', category: 'Physiological Adaptation', explanation: 'Hyponatremia causes neurological symptoms: lethargy, confusion, headache, and in severe cases seizures.' },
    { id: 'mn10', question_text: 'When teaching a client about a low-sodium diet, which food should be avoided?', option_a: 'Fresh fruits', option_b: 'Canned soups', option_c: 'Unsalted nuts', option_d: 'Fresh vegetables', correct_option: 'b', category: 'Health Promotion', explanation: 'Canned soups are high in sodium. Fresh, unprocessed foods are preferred on a low-sodium diet.' },
  ],
  nmc_cbt: [
    { id: 'uk1', question_text: 'A patient states they have a new allergy before medication. First action?', option_a: 'Administer as previously prescribed', option_b: 'Document and withhold pending review', option_c: 'Ask another nurse to give it', option_d: 'Give reduced dose', correct_option: 'b', category: 'Medicines Management', explanation: 'Document allergy, withhold medication, contact prescriber.' },
    { id: 'uk2', question_text: 'The NMC Code requires nurses to:', option_a: 'Follow senior nurses without question', option_b: 'Prioritise people, practise effectively, preserve safety, promote professionalism', option_c: 'Follow ward protocols above patient preferences', option_d: 'Report only serious incidents', correct_option: 'b', category: 'Professional Practice', explanation: 'The NMC Code has four themes: Prioritise people, Practise effectively, Preserve safety, Promote professionalism.' },
    { id: 'uk3', question_text: 'A competent patient refuses a life-saving transfusion. The nurse should:', option_a: 'Administer to save the life', option_b: 'Contact next of kin to override', option_c: 'Respect decision and document clearly', option_d: 'Ask doctor to convince patient', correct_option: 'c', category: 'Patient Safety', explanation: 'Competent adults have absolute right to refuse treatment. Document the decision.' },
    { id: 'uk4', question_text: 'WHO hand hygiene with soap and water minimum duration:', option_a: '10-15 seconds', option_b: '20-30 seconds', option_c: '40-60 seconds', option_d: '2 minutes', correct_option: 'c', category: 'Infection Control', explanation: 'WHO recommends 40-60 seconds with soap and water.' },
    { id: 'uk5', question_text: 'Required dose 500mg, tablets 250mg each. How many tablets?', option_a: '1', option_b: '1.5', option_c: '2', option_d: '2.5', correct_option: 'c', category: 'Medicines Management', explanation: '500 ÷ 250 = 2 tablets.' },
    { id: 'uk6', question_text: 'A patient\'s NEWS2 score is 7. What action is required?', option_a: 'Routine monitoring every 12 hours', option_b: 'Increase monitoring frequency', option_c: 'Urgent response — emergency assessment', option_d: 'Document and review at next shift', correct_option: 'c', category: 'Patient Safety', explanation: 'NEWS2 score ≥7 requires urgent response and emergency clinical assessment.' },
    { id: 'uk7', question_text: 'A nurse suspects a colleague is practising while impaired. Under the NMC Code, the nurse should:', option_a: 'Ignore it as it is a colleague matter', option_b: 'Raise concerns through appropriate channels immediately', option_c: 'Wait to see if it happens again', option_d: 'Ask the patient if they noticed', correct_option: 'b', category: 'Professional Practice', explanation: 'The NMC Code requires nurses to raise concerns immediately when patient safety is at risk.' },
    { id: 'uk8', question_text: 'The Mental Capacity Act 2005 states a person lacks capacity if they cannot:', option_a: 'Speak English fluently', option_b: 'Understand, retain, weigh, or communicate a decision', option_c: 'Sign their own consent form', option_d: 'Be present during decision making', correct_option: 'b', category: 'Patient Safety', explanation: 'MCA 2005 defines lacking capacity as inability to understand, retain, use/weigh, or communicate information.' },
    { id: 'uk9', question_text: 'A patient is prescribed IV morphine 5mg. The ampoule contains 10mg/mL. What volume do you draw?', option_a: '0.25mL', option_b: '0.5mL', option_c: '1mL', option_d: '2mL', correct_option: 'b', category: 'Medicines Management', explanation: 'Volume = Dose ÷ Concentration = 5mg ÷ 10mg/mL = 0.5mL.' },
    { id: 'uk10', question_text: 'Which isolation precaution is required for a patient with MRSA wound infection?', option_a: 'Standard precautions only', option_b: 'Droplet precautions', option_c: 'Contact precautions', option_d: 'Airborne precautions', correct_option: 'c', category: 'Infection Control', explanation: 'MRSA requires contact precautions — gloves and apron for direct patient contact.' },
  ],
  haad: [
    { id: 'h1', question_text: 'Which authority regulates healthcare in Abu Dhabi?', option_a: 'DHA', option_b: 'HAAD', option_c: 'MOHAP', option_d: 'JCI', correct_option: 'b', category: 'Regulatory', explanation: 'HAAD (now DOH) regulates Abu Dhabi healthcare.' },
    { id: 'h2', question_text: 'Classic MI presentation priority action?', option_a: 'Oral pain relief', option_b: '12-lead ECG and emergency team', option_c: 'Reassure and monitor', option_d: 'Position flat', correct_option: 'b', category: 'Emergency Care', explanation: 'Immediate ECG and emergency team activation is critical in suspected MI.' },
    { id: 'h3', question_text: 'Diabetic Muslim refuses insulin during Ramadan. Nurse should:', option_a: 'Withhold insulin completely', option_b: 'Consult physician and religious scholars', option_c: 'Force injection', option_d: 'Document and take no action', correct_option: 'b', category: 'Cultural Care', explanation: 'Multidisciplinary approach with cultural sensitivity. Injections permitted for medical necessity.' },
    { id: 'h4', question_text: 'UAE informed consent must be obtained for:', option_a: 'Surgery only', option_b: 'All invasive procedures and treatments', option_c: 'Only when patient requests', option_d: 'By administrator only', correct_option: 'b', category: 'Ethics', explanation: 'UAE law requires informed consent for all invasive procedures.' },
    { id: 'h5', question_text: 'DHA exam is required to practice in:', option_a: 'Abu Dhabi', option_b: 'Sharjah', option_c: 'Dubai', option_d: 'Ajman', correct_option: 'c', category: 'Regulatory', explanation: 'DHA license required for Dubai. HAAD/DOH for Abu Dhabi.' },
    { id: 'h6', question_text: 'A patient in the UAE refuses treatment but family insists on intervention. The nurse should:', option_a: 'Follow family wishes as they know best', option_b: 'Follow the competent patient\'s wishes', option_c: 'Ask the physician to decide', option_d: 'Delay treatment until agreement reached', correct_option: 'b', category: 'Ethics', explanation: 'A competent patient\'s autonomy is respected over family wishes in UAE healthcare law.' },
    { id: 'h7', question_text: 'Normal adult blood pressure range according to UAE clinical guidelines:', option_a: 'Less than 120/80 mmHg', option_b: '120-139/80-89 mmHg', option_c: '140/90 mmHg or above requires immediate treatment', option_d: 'All of the above as contextual', correct_option: 'd', category: 'Clinical Knowledge', explanation: 'Blood pressure classification considers multiple ranges. Context determines intervention threshold.' },
  ],
  nmbn: [
    { id: 'ng1', question_text: 'MSS was designed to:', option_a: 'Train specialist nurses', option_b: 'Deploy midwives to rural PHCs', option_c: 'Provide scholarships abroad', option_d: 'Regulate private practice', correct_option: 'b', category: 'Community Health', explanation: 'MSS deployed midwives to rural primary health centres to reduce maternal mortality.' },
    { id: 'ng2', question_text: 'Recommended birth-to-first-breastfeed interval:', option_a: '30 minutes', option_b: '1 hour', option_c: '2 hours', option_d: '6 hours', correct_option: 'b', category: 'Maternal & Child', explanation: 'WHO and Nigeria recommend breastfeeding within 1 hour of birth.' },
    { id: 'ng3', question_text: 'NHIS established under:', option_a: 'National Health Act 2014', option_b: 'NHIS Act Cap N42 LFN 2004', option_c: 'Medical Practitioners Act', option_d: 'Nursing Act', correct_option: 'b', category: 'Community Health', explanation: 'NHIS Act Cap N42 LFN 2004.' },
    { id: 'ng4', question_text: 'NMBN is responsible for:', option_a: 'Licensing doctors', option_b: 'Regulating nursing and midwifery in Nigeria', option_c: 'Managing hospitals', option_d: 'Distributing pharmaceuticals', correct_option: 'b', category: 'Regulatory', explanation: 'NMCN/NMBN regulates nursing and midwifery practice in Nigeria.' },
    { id: 'ng5', question_text: 'Primary malaria prevention in Nigeria:', option_a: 'Vaccination only', option_b: 'ITNs and IRS', option_c: 'Antibiotics prophylaxis', option_d: 'Water purification only', correct_option: 'b', category: 'Community Health', explanation: 'ITNs and IRS are primary malaria prevention interventions in Nigeria.' },
    { id: 'ng6', question_text: 'The Integrated Management of Childhood Illness (IMCI) strategy targets children:', option_a: 'Under 1 year', option_b: 'Under 5 years', option_c: 'Under 10 years', option_d: 'Under 15 years', correct_option: 'b', category: 'Maternal & Child', explanation: 'IMCI targets children under 5 years, addressing leading causes of childhood mortality.' },
    { id: 'ng7', question_text: 'In Nigeria, the standard immunisation schedule gives BCG vaccine at:', option_a: '6 weeks', option_b: '10 weeks', option_c: 'Birth', option_d: '14 weeks', correct_option: 'c', category: 'Community Health', explanation: 'BCG is given at birth in Nigeria to protect against tuberculosis.' },
  ],
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MockExam() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const trackKey = searchParams.get('track') || 'nclex'
  const track = TRACK_INFO[trackKey] || TRACK_INFO.nclex

  const [phase, setPhase] = useState('setup') // setup | exam | results
  const [selectedMode, setSelectedMode] = useState(0)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (phase === 'exam' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  async function startExam() {
    setLoading(true)
    const mode = track.modes[selectedMode]
    const { data } = await supabase.from('question_banks').select('*').eq('track', trackKey).eq('is_published', true).limit(mode.count)
    const seedQs = MOCK_QUESTIONS[trackKey] || []
    let questionList = data?.length ? data : seedQs
    // Shuffle
    questionList = [...questionList].sort(() => Math.random() - 0.5).slice(0, mode.count)
    setQuestions(questionList)
    setTimeLeft(mode.time * 60)
    setCurrentIndex(0)
    setAnswers({})
    setPhase('exam')
    setLoading(false)
  }

  function submitExam() {
    clearInterval(timerRef.current)
    setPhase('results')
  }

  const score = questions.length > 0
    ? Math.round((questions.filter(q => answers[q.id] === q.correct_option).length / questions.length) * 100)
    : 0

  const categoryScores = {}
  questions.forEach(q => {
    if (!categoryScores[q.category]) categoryScores[q.category] = { correct: 0, total: 0 }
    categoryScores[q.category].total++
    if (answers[q.id] === q.correct_option) categoryScores[q.category].correct++
  })

  const timePercent = phase === 'exam' && track.modes[selectedMode]
    ? (timeLeft / (track.modes[selectedMode].time * 60)) * 100
    : 100
  const isLowTime = timeLeft < 300

  if (phase === 'setup') {
    return (
      <AppShell>
        <button onClick={() => navigate('/questions')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '20px', padding: 0 }}>
          ← Back to Question Banks
        </button>

        <div style={{ background: `linear-gradient(135deg, ${track.color}, ${track.color}CC)`, borderRadius: '20px', padding: '28px', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{track.flag}</div>
          <h1 style={{ color: 'white', fontWeight: '900', fontSize: '24px', margin: '0 0 4px' }}>{track.label}</h1>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Timed Mock Examination</div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Select Exam Mode</h2>
          {track.modes.map((mode, i) => (
            <div key={i} onClick={() => setSelectedMode(i)}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', border: `2px solid ${selectedMode === i ? track.color : '#E2E8F0'}`, background: selectedMode === i ? track.bg : 'white', cursor: 'pointer', marginBottom: '10px', transition: 'all 0.2s' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: selectedMode === i ? track.color : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={20} color={selectedMode === i ? 'white' : '#94A3B8'} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>{mode.label}</div>
                <div style={{ color: '#94A3B8', fontSize: '13px' }}>{mode.time} minutes · {Math.round(mode.time / mode.count * 60)}s per question</div>
              </div>
              {selectedMode === i && <CheckCircle size={20} color={track.color} style={{ marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: '#FFF7ED', borderRadius: '14px', border: '1px solid #FDE68A', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontWeight: '700', color: '#92400E', fontSize: '13px', marginBottom: '4px' }}>⚠️ Before you start</div>
          <div style={{ color: '#92400E', fontSize: '12px', lineHeight: '1.6' }}>
            The timer starts immediately. You cannot pause the exam. Unanswered questions count as incorrect. Submit before time runs out.
          </div>
        </div>

        <button onClick={startExam} disabled={loading}
          style={{ width: '100%', padding: '16px', background: `linear-gradient(135deg, ${track.color}, ${track.color}CC)`, color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? 'Loading questions...' : <>Start Exam <ChevronRight size={18} /></>}
        </button>
      </AppShell>
    )
  }

  if (phase === 'exam') {
    const currentQ = questions[currentIndex]
    const answered = Object.keys(answers).length

    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
        {/* Exam header */}
        <div style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '14px' }}>{track.flag} {track.label} Mock Exam</div>
              <div style={{ color: '#94A3B8', fontSize: '12px' }}>{answered}/{questions.length} answered</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: isLowTime ? '#F43F5E' : '#0A2540', fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{ width: '80px', height: '4px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden', margin: '4px auto 0' }}>
                <div style={{ height: '100%', width: `${timePercent}%`, background: isLowTime ? '#F43F5E' : track.color, borderRadius: '99px', transition: 'width 1s' }} />
              </div>
            </div>
            <button onClick={submitExam}
              style={{ background: '#F43F5E', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Submit
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Question */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question {currentIndex + 1} of {questions.length} · {currentQ?.category}
            </div>
            <p style={{ fontWeight: '700', color: '#0A2540', fontSize: '16px', lineHeight: '1.5', margin: '0 0 20px' }}>{currentQ?.question_text}</p>
            {currentQ && ['a', 'b', 'c', 'd'].map(opt => {
              const selected = answers[currentQ.id] === opt
              return (
                <button key={opt}
                  onClick={() => setAnswers(a => ({ ...a, [currentQ.id]: opt }))}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: `1.5px solid ${selected ? track.color : '#E2E8F0'}`, background: selected ? track.bg : 'white', cursor: 'pointer', marginBottom: '8px', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0, background: selected ? track.color : '#F8FAFC', color: selected ? 'white' : '#94A3B8' }}>
                    {opt.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '14px', color: '#0A2540', fontWeight: selected ? '600' : '400' }}>{currentQ[`option_${opt}`]}</span>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}
              style={{ padding: '10px 20px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', color: '#64748B', opacity: currentIndex === 0 ? 0.5 : 1 }}>
              ← Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => i + 1)}
                style={{ padding: '10px 20px', background: track.color, border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: 'white' }}>
                Next →
              </button>
            ) : (
              <button onClick={submitExam}
                style={{ padding: '10px 20px', background: '#22C55E', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: 'white' }}>
                Submit Exam
              </button>
            )}
          </div>

          {/* Question grid */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase' }}>Question Navigator</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {questions.map((q, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                    background: i === currentIndex ? track.color : answers[q.id] ? '#F0FDF4' : '#F1F5F9',
                    color: i === currentIndex ? 'white' : answers[q.id] ? '#22C55E' : '#94A3B8' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results
  return (
    <AppShell>
      <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0A2540', margin: '0 0 20px' }}>Exam Results</h1>

      {/* Score */}
      <div style={{ background: score >= 70 ? 'linear-gradient(135deg,#22C55E,#16A34A)' : score >= 50 ? 'linear-gradient(135deg,#F59E0B,#D97706)' : 'linear-gradient(135deg,#F43F5E,#DC2626)', borderRadius: '20px', padding: '32px', textAlign: 'center', marginBottom: '20px', color: 'white' }}>
        <div style={{ fontSize: '64px', fontWeight: '900', lineHeight: 1 }}>{score}%</div>
        <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '8px' }}>
          {score >= 70 ? '🏆 Passed!' : score >= 50 ? '⚠️ Nearly There' : '📚 Keep Practising'}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '6px' }}>
          {questions.filter(q => answers[q.id] === q.correct_option).length} of {questions.length} correct
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '4px' }}>
          {track.flag} {track.label} Mock Exam
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Performance by Category</h2>
        {Object.entries(categoryScores).map(([cat, data]) => {
          const pct = Math.round((data.correct / data.total) * 100)
          const color = pct >= 70 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#F43F5E'
          return (
            <div key={cat} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>{cat}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color }}>{pct}% ({data.correct}/{data.total})</span>
              </div>
              <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: '99px', transition: 'width 0.5s' }} />
              </div>
              {pct < 60 && <div style={{ fontSize: '11px', color: '#F43F5E', marginTop: '3px' }}>⚠️ Needs more practice</div>}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => { setPhase('setup'); setAnswers({}); setCurrentIndex(0) }}
          style={{ flex: 1, padding: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <RotateCcw size={14} /> Retake
        </button>
        <button onClick={() => navigate('/questions')}
          style={{ flex: 1, padding: '14px', background: `linear-gradient(135deg, ${track.color}, ${track.color}CC)`, border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', color: 'white' }}>
          Back to Questions
        </button>
      </div>
    </AppShell>
  )
}

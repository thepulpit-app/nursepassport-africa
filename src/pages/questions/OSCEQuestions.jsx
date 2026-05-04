import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'

const OSCE_STATIONS = [
  {
    id: 'o1', title: 'Hand Washing Technique', category: 'Infection Control', difficulty: 'beginner',
    scenario: 'You are about to perform a wound dressing. Demonstrate and explain the WHO 6-step hand hygiene technique using soap and water.',
    steps: ['Wet hands with water', 'Apply enough soap to cover all surfaces', 'Rub hands palm to palm', 'Rub back of each hand with palm of other hand', 'Rub palm to palm with fingers interlaced', 'Rub backs of fingers to opposing palms', 'Rub each thumb clasped in opposite hand', 'Rub tips of fingers in opposite palm', 'Rinse hands with water', 'Dry thoroughly with single-use towel', 'Use towel to turn off faucet'],
    keyPoints: ['Minimum 40-60 seconds with soap and water', 'Cover all surfaces including thumbs and between fingers', 'Dry hands completely — wet hands transfer bacteria more easily', 'Use towel to turn off tap to avoid recontamination'],
    markScheme: ['Correct sequence (40%)', 'Duration ≥40 seconds (20%)', 'All surfaces covered (20%)', 'Correct towel use (20%)'],
  },
  {
    id: 'o2', title: 'Blood Pressure Measurement', category: 'Clinical Skills', difficulty: 'beginner',
    scenario: 'Mrs Adaeze, 45 years old, attends the clinic for a routine check. Demonstrate how you would measure her blood pressure and explain what you are doing.',
    steps: ['Introduce yourself and confirm patient identity', 'Explain procedure and obtain consent', 'Position patient seated, arm at heart level', 'Select appropriate cuff size', 'Apply cuff 2-3cm above antecubital fossa', 'Palpate brachial artery', 'Inflate to 30mmHg above disappearance of radial pulse', 'Deflate at 2mmHg per second', 'Record systolic (first sound) and diastolic (last sound)', 'Document with date, time, arm used, and position'],
    keyPoints: ['Correct cuff size is critical — too small gives falsely high reading', 'Patient should be seated, rested for 5 minutes', 'Two readings should be taken and averaged', 'Normal: <120/80 mmHg; Hypertension: ≥140/90 mmHg'],
    markScheme: ['Patient identification & consent (20%)', 'Correct positioning (20%)', 'Correct technique (40%)', 'Accurate recording (20%)'],
  },
  {
    id: 'o3', title: 'IM Injection Technique', category: 'Medicines Management', difficulty: 'intermediate',
    scenario: 'A patient requires an IM injection of diclofenac 75mg. The available ampoule contains 75mg/3mL. Demonstrate the procedure on a mannequin.',
    steps: ['Check prescription, drug, dose, route, time, patient', 'Wash hands and prepare equipment', 'Calculate dose: 75mg ÷ 25mg/mL = 3mL', 'Draw up correct volume using aseptic technique', 'Identify ventrogluteal site', 'Clean skin with swab — allow to dry', 'Stretch skin (Z-track if required)', 'Insert needle at 90 degrees', 'Aspirate briefly', 'Inject slowly and steadily', 'Withdraw and apply gentle pressure', 'Dispose of sharps immediately', 'Document administration'],
    keyPoints: ['Always use the 6 rights of medication administration', 'Ventrogluteal is preferred site in adults', 'Allow skin to dry after cleaning — alcohol inhibits drug absorption', 'Never recap needles — dispose directly into sharps bin'],
    markScheme: ['Drug calculation correct (20%)', 'Aseptic technique (25%)', 'Site selection and technique (35%)', 'Sharps safety (20%)'],
  },
  {
    id: 'o4', title: 'Breaking Bad News', category: 'Communication', difficulty: 'advanced',
    scenario: 'Mr Chidi, 52 years old, has been awaiting biopsy results. His results indicate cancer. You are the nurse present when the doctor breaks this news. Demonstrate how you would support the patient.',
    steps: ['Ensure privacy — draw curtains, ask others to leave', 'Sit at eye level — do not stand over patient', 'Use patient\'s name', 'Listen actively — do not interrupt', 'Allow silence — sit with the patient', 'Acknowledge emotions: "This must be very difficult..."', 'Avoid medical jargon', 'Do not give false reassurance', 'Provide factual information when patient is ready', 'Offer to contact family/support person', 'Document the conversation and patient\'s response'],
    keyPoints: ['SPIKES model: Setting, Perception, Invitation, Knowledge, Emotions, Strategy', 'Silence is powerful — do not rush to fill it', 'Follow the patient\'s lead on how much information they want', 'Ensure follow-up plan is clear before leaving'],
    markScheme: ['Environment and privacy (15%)', 'Active listening and empathy (35%)', 'Appropriate communication style (30%)', 'Follow-up plan (20%)'],
  },
  {
    id: 'o5', title: 'Urinary Catheterisation (Female)', category: 'Clinical Skills', difficulty: 'advanced',
    scenario: 'A female patient requires urinary catheterisation for urinary retention. Demonstrate the procedure using a mannequin, explaining each step.',
    steps: ['Confirm indication and obtain consent', 'Gather equipment — maintain sterility', 'Position patient supine, legs apart', 'Wash hands and apply sterile gloves', 'Clean meatus with antiseptic — front to back', 'Identify urethral meatus', 'Insert catheter 5-7cm until urine flows', 'Inflate balloon with correct volume (check balloon label)', 'Connect to drainage bag', 'Secure catheter to thigh', 'Document date, time, catheter size, balloon volume, urine output'],
    keyPoints: ['Strict aseptic technique throughout', 'Never force the catheter — if resistance, reassess', 'Inflate balloon only after urine is draining', 'Document fully — catheter care is a major infection risk area'],
    markScheme: ['Consent and preparation (15%)', 'Aseptic technique (40%)', 'Correct procedure steps (35%)', 'Documentation (10%)'],
  },
]

export default function OSCEQuestions() {
  const { tier } = useAuth()
  const navigate = useNavigate()
  const [activeStation, setActiveStation] = useState(null)
  const [showAnswers, setShowAnswers] = useState(false)
  const [selfScore, setSelfScore] = useState(null)

  if (tier !== 'passport') {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0A2540', marginBottom: '8px' }}>OSCE Preparation</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Practice clinical skills stations with structured mark schemes. Designed for NMC OSCE and UAE clinical assessments. Passport plan only.
          </p>
          <button onClick={() => navigate('/billing')}
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A2540', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
            Upgrade to Passport
          </button>
        </div>
      </AppShell>
    )
  }

  if (!activeStation) {
    return (
      <AppShell>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>OSCE Stations</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Clinical skills practice with structured mark schemes</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>🏥 How to use OSCE stations</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.5' }}>
            Read the scenario, practise the steps on a mannequin or with a partner, then reveal the mark scheme and score yourself honestly.
          </div>
        </div>

        {OSCE_STATIONS.map(station => {
          const diffColor = { beginner: '#22C55E', intermediate: '#F59E0B', advanced: '#F43F5E' }[station.difficulty]
          const diffBg = { beginner: '#F0FDF4', intermediate: '#FFFBEB', advanced: '#FFF1F2' }[station.difficulty]
          return (
            <div key={station.id}
              onClick={() => { setActiveStation(station); setShowAnswers(false); setSelfScore(null) }}
              style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', flexShrink: 0 }}>🏥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px', marginBottom: '3px' }}>{station.title}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: diffBg, color: diffColor }}>{station.difficulty}</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', padding: '2px 0' }}>{station.category}</span>
                </div>
              </div>
              <ChevronRight size={18} color="#CBD5E1" />
            </div>
          )
        })}
      </AppShell>
    )
  }

  return (
    <AppShell>
      <button onClick={() => setActiveStation(null)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '16px', padding: 0 }}>
        ← Back to Stations
      </button>

      <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '20px', padding: '20px', marginBottom: '16px', color: 'white' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>OSCE Station · {activeStation.category}</div>
        <h1 style={{ color: 'white', fontWeight: '800', fontSize: '20px', margin: '0 0 12px' }}>{activeStation.title}</h1>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Clinical Scenario</div>
          <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{activeStation.scenario}</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>Step-by-Step Procedure</h2>
        {activeStation.steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
            <div style={{ fontSize: '14px', color: '#0A2540', lineHeight: '1.5', paddingTop: '3px' }}>{step}</div>
          </div>
        ))}
      </div>

      {/* Key points */}
      <div style={{ background: '#EEF2FF', borderRadius: '16px', border: '1px solid #C7D2FE', padding: '16px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#4F46E5', margin: '0 0 10px' }}>💡 Key Clinical Points</h2>
        {activeStation.keyPoints.map((point, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle size={14} color="#4F46E5" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '13px', color: '#3730A3', lineHeight: '1.5' }}>{point}</span>
          </div>
        ))}
      </div>

      {/* Mark scheme */}
      {!showAnswers ? (
        <button onClick={() => setShowAnswers(true)}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A2540', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginBottom: '12px' }}>
          Reveal Mark Scheme
        </button>
      ) : (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>Mark Scheme</h2>
          {activeStation.markScheme.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: '#22C55E', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={12} color="white" />
              </div>
              <span style={{ fontSize: '13px', color: '#0A2540', fontWeight: '500' }}>{item}</span>
            </div>
          ))}

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A2540', marginBottom: '10px' }}>How did you do?</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: '90-100%', value: 95, color: '#22C55E', bg: '#F0FDF4' },
                { label: '70-89%', value: 80, color: '#4F46E5', bg: '#EEF2FF' },
                { label: '50-69%', value: 60, color: '#F59E0B', bg: '#FFFBEB' },
                { label: '<50%', value: 30, color: '#F43F5E', bg: '#FFF1F2' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setSelfScore(opt.value)}
                  style={{ flex: 1, padding: '10px 4px', background: selfScore === opt.value ? opt.color : opt.bg, border: `1.5px solid ${opt.color}`, borderRadius: '10px', fontWeight: '700', fontSize: '11px', cursor: 'pointer', color: selfScore === opt.value ? 'white' : opt.color, transition: 'all 0.2s' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {selfScore !== null && selfScore < 70 && (
              <div style={{ background: '#FFF1F2', borderRadius: '10px', padding: '12px', marginTop: '10px' }}>
                <div style={{ fontSize: '13px', color: '#F43F5E', fontWeight: '700', marginBottom: '4px' }}>📚 Recommendation</div>
                <div style={{ fontSize: '12px', color: '#9F1239' }}>Review the key clinical points above and practise this station again before your OSCE. Focus on the mark scheme criteria you missed.</div>
              </div>
            )}
            {selfScore !== null && selfScore >= 70 && (
              <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '12px', marginTop: '10px' }}>
                <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: '700', marginBottom: '4px' }}>✅ Well done!</div>
                <div style={{ fontSize: '12px', color: '#166534' }}>Good performance. Continue to the next station to maintain your momentum.</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => { setShowAnswers(false); setSelfScore(null) }}
          style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <RotateCcw size={14} /> Restart
        </button>
        <button onClick={() => setActiveStation(null)}
          style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', color: 'white' }}>
          Next Station
        </button>
      </div>
    </AppShell>
  )
}

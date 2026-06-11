import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle, XCircle, Lightbulb, Target, BookOpen, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

const DEMO_SCENARIO = {
  id: 'demo',
  title: 'Normal CTG — Confirming Reassurance',
  category: 'ctg',
  difficulty: 'beginner',
  tier_required: 'free',
  patient_brief: 'A 39-year-old primigravida at 39 weeks is in early labour. She has been on continuous CTG monitoring for 30 minutes. The trace shows a baseline of 135 bpm, variability of 10-15 bpm, two accelerations in 20 minutes, and no decelerations. Contractions are every 5 minutes lasting 45 seconds.',
  correct_actions: '1. Classify the CTG as normal/reassuring using all four features\n2. Document baseline, variability, accelerations and decelerations\n3. Continue routine monitoring and reassure the mother\n4. Inform the midwife in charge of the normal findings',
  scoring_rubric: 'Score 90-100: Correctly identifies all 4 features, classifies as normal, documents and communicates findings. Score 60-89: Identifies most features but misses one. Score below 60: Misclassifies CTG.',
  teaching_points: 'A normal CTG has all four reassuring features: baseline 110-160 bpm, variability 5-25 bpm, at least 2 accelerations in 20 minutes, and no decelerations. All four must be present to classify as normal.',
}

export default function TryDemo() {
  const navigate = useNavigate()
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit() {
    if (!response.trim() || response.trim().length < 20) return
    setLoading(true)
    setError(null)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const res = await fetch(`${supabaseUrl}/functions/v1/claude-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: DEMO_SCENARIO, nurseResponse: response })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFeedback(data)
    } catch (err) {
      setError('Unable to get feedback right now. Please try again.')
    }
    setLoading(false)
  }

  const scoreGradient = feedback
    ? feedback.score >= 70 ? 'linear-gradient(135deg, #22C55E, #16A34A)'
    : feedback.score >= 50 ? 'linear-gradient(135deg, #F59E0B, #D97706)'
    : 'linear-gradient(135deg, #F43F5E, #DC2626)'
    : ''

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '14px' }}>NursePassport Africa</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Free Clinical Simulation Demo</div>
          </div>
        </div>
        <button onClick={() => navigate('/signup')}
          style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 16px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
          Create Free Account
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px' }}>

        {/* Demo badge */}
        <div style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '13px' }}>Free Demo — No Account Needed</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Try one real ClinicalSim AI scenario. Create a free account to access 62+ more.</div>
          </div>
        </div>

        {/* Scenario */}
        <div style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '20px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🩺 ClinicalSim AI · Demo</div>
            <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', background: '#F0FDF4', color: '#16A34A' }}>Beginner</span>
          </div>
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: '17px', lineHeight: '1.3', margin: '0 0 14px' }}>{DEMO_SCENARIO.title}</h1>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '14px' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Patient Scenario</div>
            <p style={{ color: 'white', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{DEMO_SCENARIO.patient_brief}</p>
          </div>
        </div>

        {!feedback ? (
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '34px', height: '34px', background: '#FFF1F2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={16} color="#F43F5E" />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>Your Clinical Response</div>
                <div style={{ color: '#94A3B8', fontSize: '12px' }}>What would you do as the nurse on duty?</div>
              </div>
            </div>
            <textarea
              rows={6}
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Describe your clinical assessment and the actions you would take..."
              style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0A2540', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5', boxSizing: 'border-box' }}
            />
            {error && <div style={{ color: '#F43F5E', fontSize: '12px', marginTop: '8px' }}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{response.length} chars · min 20</span>
              <button onClick={handleSubmit} disabled={loading || response.trim().length < 20}
                style={{ background: response.trim().length >= 20 ? 'linear-gradient(135deg, #F43F5E, #EC4899)' : '#F1F5F9', color: response.trim().length >= 20 ? 'white' : '#94A3B8', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: '700', fontSize: '14px', cursor: response.trim().length >= 20 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {loading ? 'Analysing...' : <><Send size={15} /> Submit Response</>}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Score */}
            <div style={{ background: scoreGradient, borderRadius: '20px', padding: '28px 24px', textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '64px', fontWeight: '800', color: 'white', lineHeight: 1 }}>{feedback.score}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>out of 100</div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginTop: '10px' }}>
                {feedback.score >= 70 ? '✅ Competent Response' : feedback.score >= 50 ? '⚠️ Partially Correct' : '📚 Needs Review'}
              </div>
            </div>

            {/* Feedback cards */}
            {feedback.what_was_correct && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #BBF7D0', padding: '16px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#22C55E', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={13} /> What You Got Right
                </div>
                <p style={{ color: '#0A2540', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{feedback.what_was_correct}</p>
              </div>
            )}

            {feedback.what_was_missed && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #FECDD3', padding: '16px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#F43F5E', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={13} /> What Was Missed
                </div>
                <p style={{ color: '#0A2540', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{feedback.what_was_missed}</p>
              </div>
            )}

            {feedback.learning_tip && (
              <div style={{ background: '#FFFBEB', borderRadius: '16px', border: '1px solid #FDE68A', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#D97706', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={13} /> Clinical Pearl
                </div>
                <p style={{ color: '#92400E', fontSize: '13px', lineHeight: '1.6', margin: 0, fontWeight: '600' }}>{feedback.learning_tip}</p>
              </div>
            )}

            {/* Conversion CTA */}
            <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🩺</div>
              <h3 style={{ color: 'white', fontWeight: '800', fontSize: '18px', margin: '0 0 8px' }}>
                {feedback.score >= 70 ? 'Excellent! Ready for more?' : 'Keep practising — you\'re improving!'}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}>
                Access 62+ clinical scenarios across CTG, Obstetrics, BLS, NMC OSCE, HAAD, NCLEX and more. Free to start.
              </p>
              <button onClick={() => navigate('/signup')}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                Create Your Free Account <ArrowRight size={18} />
              </button>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>No credit card required · Free tier available forever</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle, XCircle, Lightbulb, Target, BookOpen, RotateCcw, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { evaluateSimResponse } from '../../lib/claude'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'

const DIFFICULTY_STYLES = {
  beginner:     { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  intermediate: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
  advanced:     { bg: '#FFF1F2', color: '#F43F5E', border: '#FECDD3' },
}

export default function SimSession() {
  const { scenarioId } = useParams()
  const { state } = useLocation()
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const scenario = state?.scenario
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startTime] = useState(Date.now())

  if (!scenario) { navigate('/simulate'); return null }

  const diff = DIFFICULTY_STYLES[scenario.difficulty] || DIFFICULTY_STYLES.beginner

  async function handleSubmit() {
    if (!response.trim() || response.trim().length < 20) return toast.error('Please provide a more detailed clinical response')
    setLoading(true)
    try {
      const result = await evaluateSimResponse(scenario, response)
      const timeTaken = Math.round((Date.now() - startTime) / 1000)
      await supabase.from('sim_sessions').insert({
        user_id: profile.id,
        scenario_id: scenario.id?.startsWith('seed-') ? null : scenario.id,
        user_response: response,
        ai_feedback: JSON.stringify(result),
        score: result.score,
        is_correct: result.is_correct,
        time_taken_seconds: timeTaken,
      })
      await supabase.from('profiles').update({ sim_sessions_used: (profile.sim_sessions_used || 0) + 1 }).eq('id', profile.id)
      await refreshProfile()
      setFeedback(result)
    } catch (err) {
      toast.error('Error getting feedback. Please try again.')
    }
    setLoading(false)
  }

  const scoreColor = feedback ? (feedback.score >= 70 ? '#22C55E' : feedback.score >= 50 ? '#F59E0B' : '#F43F5E') : '#6366F1'
  const scoreGradient = feedback ? (feedback.score >= 70 ? 'linear-gradient(135deg, #22C55E, #16A34A)' : feedback.score >= 50 ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #F43F5E, #DC2626)') : ''

  return (
    <AppShell>
      <style>{`
        .feedback-card { background: white; border-radius: 16px; border: 1px solid #F1F5F9; padding: 18px; margin-bottom: 12px; }
        .feedback-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .response-area { width: 100%; padding: 14px; border-radius: 14px; border: 1.5px solid #E2E8F0; font-size: 14px; color: #0A2540; outline: none; resize: none; font-family: inherit; line-height: 1.5; transition: border-color 0.2s; box-sizing: border-box; }
        .response-area:focus { border-color: #F43F5E; }
      `}</style>

      <button onClick={() => navigate('/simulate')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '16px', padding: 0 }}>
        <ArrowLeft size={16} /> Back to Scenarios
      </button>

      {/* Scenario header */}
      <div style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '20px', padding: '20px', marginBottom: '16px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            🩺 ClinicalSim AI
          </div>
          <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', background: diff.bg, color: diff.color }}>
            {scenario.difficulty}
          </span>
        </div>
        <h1 style={{ color: 'white', fontWeight: '800', fontSize: '17px', lineHeight: '1.3', margin: '0 0 14px' }}>{scenario.title}</h1>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '14px' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Patient Scenario</div>
          <p style={{ color: 'white', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{scenario.patient_brief}</p>
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
              <div style={{ color: '#94A3B8', fontSize: '12px' }}>Be specific — actions, escalation, documentation</div>
            </div>
          </div>
          <textarea
            className="response-area"
            rows={6}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Describe your clinical assessment and the actions you would take..."
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{response.length} chars · min 20</span>
            <button onClick={handleSubmit} disabled={loading || response.trim().length < 20}
              style={{ background: response.trim().length >= 20 ? 'linear-gradient(135deg, #F43F5E, #EC4899)' : '#F1F5F9', color: response.trim().length >= 20 ? 'white' : '#94A3B8', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: '700', fontSize: '14px', cursor: response.trim().length >= 20 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? 'Analysing...' : <><Send size={15} /> Submit</>}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Score */}
          <div style={{ background: scoreGradient, borderRadius: '20px', padding: '24px', textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '56px', fontWeight: '800', color: 'white', lineHeight: 1 }}>{feedback.score}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>out of 100</div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginTop: '8px' }}>
              {feedback.score >= 70 ? '✅ Competent Response' : feedback.score >= 50 ? '⚠️ Partially Correct' : '❌ Needs Review'}
            </div>
          </div>

          {/* Your response */}
          <div className="feedback-card">
            <div className="feedback-label" style={{ color: '#94A3B8' }}>
              <BookOpen size={13} /> Your Response
            </div>
            <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: 0, fontStyle: 'italic', background: '#F8FAFC', borderRadius: '10px', padding: '12px' }}>{response}</p>
          </div>

          {/* What was correct */}
          {feedback.what_was_correct && (
            <div className="feedback-card" style={{ borderColor: '#BBF7D0' }}>
              <div className="feedback-label" style={{ color: '#22C55E' }}>
                <CheckCircle size={13} /> What You Got Right
              </div>
              <p style={{ color: '#0A2540', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{feedback.what_was_correct}</p>
            </div>
          )}

          {/* What was missed */}
          {feedback.what_was_missed && (
            <div className="feedback-card" style={{ borderColor: '#FECDD3' }}>
              <div className="feedback-label" style={{ color: '#F43F5E' }}>
                <XCircle size={13} /> What Was Missed
              </div>
              <p style={{ color: '#0A2540', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{feedback.what_was_missed}</p>
            </div>
          )}

          {/* Ideal pathway */}
          {feedback.ideal_pathway && (
            <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '18px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Target size={14} color="#F59E0B" />
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F59E0B' }}>Ideal Clinical Pathway</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{feedback.ideal_pathway}</p>
            </div>
          )}

          {/* Clinical principle */}
          {feedback.clinical_principle && (
            <div className="feedback-card" style={{ background: '#EEF2FF', borderColor: '#C7D2FE' }}>
              <div className="feedback-label" style={{ color: '#4F46E5' }}>
                <BookOpen size={13} /> Clinical Principle (NICE/RCOG)
              </div>
              <p style={{ color: '#3730A3', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{feedback.clinical_principle}</p>
            </div>
          )}

          {/* Learning tip */}
          {feedback.learning_tip && (
            <div className="feedback-card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
              <div className="feedback-label" style={{ color: '#D97706' }}>
                <Lightbulb size={13} /> Clinical Pearl 💡
              </div>
              <p style={{ color: '#92400E', fontSize: '13px', lineHeight: '1.6', margin: 0, fontWeight: '600' }}>{feedback.learning_tip}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => { setFeedback(null); setResponse('') }}
              style={{ flex: 1, padding: '13px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <RotateCcw size={14} /> Try Again
            </button>
            <button onClick={() => navigate('/simulate')}
              style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}

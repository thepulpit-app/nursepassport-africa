import { useState, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle, XCircle, Lightbulb, Target, BookOpen, RotateCcw, ChevronRight, Share2, Download } from 'lucide-react'
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
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)
  const [startTime] = useState(Date.now())
  const canvasRef = useRef(null)

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

      // Auto-post to community feed
      if (!scenario.id?.startsWith('seed-')) {
        const scoreLabel = result.score >= 70 ? '✅ Competent' : result.score >= 50 ? '⚠️ Partially Correct' : '📚 Needs Review'
        const message = result.score >= 70
          ? `Just completed a ClinicalSim scenario and scored ${result.score}%! ${scoreLabel} 🩺 Keep practising nurses!`
          : `Completed a ClinicalSim scenario and scored ${result.score}%. ${scoreLabel} — learning every day! 💪`
        await supabase.from('community_posts').insert({
          user_id: profile.id,
          content: message,
          post_type: 'sim_score',
          sim_score: result.score,
          sim_scenario_title: scenario.title,
        })
      }
    } catch (err) {
      toast.error('Error getting feedback. Please try again.')
    }
    setLoading(false)
  }

  function generateScoreCard() {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080
    const ctx = canvas.getContext('2d')

    const score = feedback.score
    const isPass = score >= 70
    const isMid = score >= 50

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
    if (isPass) { grad.addColorStop(0, '#0A2540'); grad.addColorStop(1, '#166534') }
    else if (isMid) { grad.addColorStop(0, '#0A2540'); grad.addColorStop(1, '#92400E') }
    else { grad.addColorStop(0, '#0A2540'); grad.addColorStop(1, '#7F1D1D') }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1080, 1080)

    // Subtle circle decoration
    ctx.beginPath()
    ctx.arc(900, 200, 300, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(150, 900, 250, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()

    // NursePassport Africa branding
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = 'bold 32px system-ui'
    ctx.fillText('NursePassport Africa', 80, 80)
    ctx.font = '24px system-ui'
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText('by AMCC · nursepassportafrica.com', 80, 118)

    // ClinicalSim label
    ctx.fillStyle = isPass ? '#86EFAC' : isMid ? '#FDE68A' : '#FCA5A5'
    ctx.font = 'bold 28px system-ui'
    ctx.fillText('ClinicalSim AI', 80, 240)

    // Scenario title
    ctx.fillStyle = 'white'
    ctx.font = 'bold 44px system-ui'
    const title = scenario.title.length > 40 ? scenario.title.substring(0, 40) + '...' : scenario.title
    ctx.fillText(title, 80, 310)

    // Score circle
    ctx.beginPath()
    ctx.arc(540, 580, 220, 0, Math.PI * 2)
    ctx.fillStyle = isPass ? 'rgba(34,197,94,0.2)' : isMid ? 'rgba(245,158,11,0.2)' : 'rgba(244,63,94,0.2)'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(540, 580, 220, 0, Math.PI * 2)
    ctx.strokeStyle = isPass ? '#22C55E' : isMid ? '#F59E0B' : '#F43F5E'
    ctx.lineWidth = 8
    ctx.stroke()

    // Score number
    ctx.fillStyle = 'white'
    ctx.font = 'bold 160px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(score, 540, 630)
    ctx.font = 'bold 36px system-ui'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText('out of 100', 540, 690)

    // Result label
    ctx.font = 'bold 48px system-ui'
    ctx.fillStyle = isPass ? '#86EFAC' : isMid ? '#FDE68A' : '#FCA5A5'
    ctx.fillText(isPass ? '✓ Competent Response' : isMid ? '⚠ Partially Correct' : '📚 Needs Review', 540, 820)

    // Tagline
    ctx.font = '30px system-ui'
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText('Train here. Work anywhere. 🌍', 540, 960)

    ctx.textAlign = 'left'
    return canvas
  }

  async function shareToSocial(platform) {
    setSharing(true)
    try {
      const canvas = generateScoreCard()
      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const imageFile = new File([imageBlob], 'my-clinical-score.png', { type: 'image/png' })

      const text = `I just scored ${feedback.score}% on a clinical simulation on NursePassport Africa! 🩺\n\nScenario: ${scenario.title}\n\nTrain here. Work anywhere. 🌍\nnursepassportafrica.com`

      if (platform === 'download') {
        const url = URL.createObjectURL(imageBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nursepassport-score-${feedback.score}.png`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Score card downloaded!')
        setShared(true)
      } else if (navigator.share && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({ files: [imageFile], title: 'My ClinicalSim Score', text })
        setShared(true)
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
        setShared(true)
      } else if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
        setShared(true)
      } else {
        // Fallback — download
        const url = URL.createObjectURL(imageBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nursepassport-score-${feedback.score}.png`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Score card saved!')
        setShared(true)
      }
    } catch (err) {
      toast.error('Could not share. Try downloading instead.')
    }
    setSharing(false)
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
        .share-btn { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 12px; border: none; cursor: pointer; font-weight: 700; font-size: 13px; flex: 1; justify-content: center; transition: all 0.2s; }
        .share-btn:hover { transform: translateY(-1px); }
        @keyframes celebrate { 0% { transform: scale(0.8) rotate(-5deg); opacity: 0; } 50% { transform: scale(1.05) rotate(2deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .celebrate { animation: celebrate 0.5s ease-out forwards; }
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
          {/* Score card with celebration */}
          <div className="celebrate" style={{ background: scoreGradient, borderRadius: '20px', padding: '32px 24px', textAlign: 'center', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '24px', opacity: 0.3 }}>🎉</div>
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', opacity: 0.3 }}>🎊</div>
            <div style={{ position: 'absolute', bottom: '10px', left: '20px', fontSize: '20px', opacity: 0.3 }}>⭐</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '20px', fontSize: '20px', opacity: 0.3 }}>✨</div>
            <div style={{ fontSize: '72px', fontWeight: '800', color: 'white', lineHeight: 1 }}>{feedback.score}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>out of 100</div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginTop: '10px' }}>
              {feedback.score >= 70 ? '✅ Competent Response' : feedback.score >= 50 ? '⚠️ Partially Correct' : '📚 Needs Review'}
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              {feedback.score >= 70 ? 'Excellent clinical reasoning! 🌟' : feedback.score >= 50 ? 'Good effort — keep practising!' : 'Review the feedback and try again'}
            </div>
          </div>

          {/* Share section */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid #F1F5F9' }}>
            <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '14px', marginBottom: '4px' }}>
              {shared ? '🎉 Score shared to community!' : '📤 Share your score'}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '14px' }}>
              {shared ? 'Your score has been posted to the community feed' : 'Celebrate your progress and inspire other nurses'}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="share-btn" onClick={() => shareToSocial('download')} disabled={sharing}
                style={{ background: '#F8FAFC', color: '#0A2540', border: '1.5px solid #E2E8F0' }}>
                <Download size={15} /> Save Card
              </button>
              <button className="share-btn" onClick={() => shareToSocial('whatsapp')} disabled={sharing}
                style={{ background: '#DCF8C6', color: '#166534', border: '1.5px solid #86EFAC' }}>
                📱 WhatsApp
              </button>
              <button className="share-btn" onClick={() => shareToSocial('twitter')} disabled={sharing}
                style={{ background: '#E7F5FE', color: '#1D4ED8', border: '1.5px solid #BAE6FD' }}>
                🐦 X / Twitter
              </button>
              <button className="share-btn" onClick={() => shareToSocial('share')} disabled={sharing}
                style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none' }}>
                <Share2 size={15} /> {sharing ? 'Sharing...' : 'Share'}
              </button>
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

import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle, XCircle, Lightbulb, Target, BookOpen, RotateCcw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { evaluateSimResponse } from '../../lib/claude'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

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

  if (!scenario) {
    navigate('/simulate')
    return null
  }

  async function handleSubmit() {
    if (!response.trim() || response.trim().length < 20) {
      return toast.error('Please provide a more detailed clinical response')
    }
    setLoading(true)
    try {
      const result = await evaluateSimResponse(scenario, response)
      const timeTaken = Math.round((Date.now() - startTime) / 1000)

      // Save to database
      await supabase.from('sim_sessions').insert({
        user_id: profile.id,
        scenario_id: scenario.id.startsWith('seed-') ? null : scenario.id,
        user_response: response,
        ai_feedback: JSON.stringify(result),
        score: result.score,
        is_correct: result.is_correct,
        time_taken_seconds: timeTaken,
      })

      // Increment session counter
      await supabase.from('profiles').update({
        sim_sessions_used: (profile.sim_sessions_used || 0) + 1
      }).eq('id', profile.id)

      await refreshProfile()
      setFeedback(result)
    } catch (err) {
      toast.error('Error getting feedback. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  const DIFFICULTY_COLORS = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  return (
    <AppShell>
      {/* Back button */}
      <button onClick={() => navigate('/simulate')}
        className="flex items-center gap-2 text-[#64748B] hover:text-[#0A2540] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-[#0A2540] rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">ClinicalSim AI</div>
            <h1 className="text-white font-bold text-xl leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {scenario.title}
            </h1>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </div>

        {/* Patient brief */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">Patient Scenario</div>
          <p className="text-white leading-relaxed text-sm">{scenario.patient_brief}</p>
        </div>
      </div>

      {!feedback ? (
        /* Response input */
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-[#00897B]" />
            <h2 className="font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Clinical Response</h2>
          </div>
          <p className="text-[#64748B] text-sm mb-4">
            Respond as you would in clinical practice. Be specific — include immediate actions, escalation steps, documentation, and patient communication.
          </p>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={6}
            placeholder="e.g. I would immediately call the registrar/consultant, classify this CTG as pathological due to the sinusoidal pattern, prepare for emergency C-section by notifying theatre, ensure IV access is patent, document the time of recognition and actions taken, and reassure the patient while maintaining continuous monitoring..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/10 outline-none text-[#0A2540] placeholder:text-gray-300 resize-none text-sm transition-all"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-[#64748B]">{response.length} characters · min 20</span>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={response.trim().length < 20}
            >
              <Send size={16} />
              Submit for Assessment
            </Button>
          </div>
        </div>
      ) : (
        /* Feedback panel */
        <div className="space-y-4 fade-up">
          {/* Score */}
          <div className={`rounded-2xl p-6 text-center ${feedback.score >= 70 ? 'bg-[#00897B]' : feedback.score >= 50 ? 'bg-[#F4A300]' : 'bg-[#C62828]'}`}>
            <div className="text-6xl font-extrabold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{feedback.score}</div>
            <div className="text-white/80 text-sm font-medium">out of 100</div>
            <div className="text-white font-semibold mt-2">
              {feedback.score >= 70 ? '✅ Competent Response' : feedback.score >= 50 ? '⚠️ Partially Correct' : '❌ Needs Review'}
            </div>
          </div>

          {/* Your response */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Your Response</div>
            <p className="text-[#0A2540] text-sm leading-relaxed bg-gray-50 rounded-xl p-4 italic">{response}</p>
          </div>

          {/* What was correct */}
          {feedback.what_was_correct && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-[#00897B]" />
                <div className="font-semibold text-[#0A2540] text-sm">What You Got Right</div>
              </div>
              <p className="text-[#0A2540] text-sm leading-relaxed">{feedback.what_was_correct}</p>
            </div>
          )}

          {/* What was missed */}
          {feedback.what_was_missed && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={18} className="text-[#F57C00]" />
                <div className="font-semibold text-[#0A2540] text-sm">What Was Missed</div>
              </div>
              <p className="text-[#0A2540] text-sm leading-relaxed">{feedback.what_was_missed}</p>
            </div>
          )}

          {/* Ideal pathway */}
          {feedback.ideal_pathway && (
            <div className="bg-[#0A2540] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-[#F4A300]" />
                <div className="font-semibold text-white text-sm">Ideal Clinical Pathway</div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{feedback.ideal_pathway}</p>
            </div>
          )}

          {/* Clinical principle */}
          {feedback.clinical_principle && (
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-blue-600" />
                <div className="font-semibold text-blue-800 text-sm">Clinical Principle (NICE/RCOG)</div>
              </div>
              <p className="text-blue-700 text-sm leading-relaxed">{feedback.clinical_principle}</p>
            </div>
          )}

          {/* Learning tip */}
          {feedback.learning_tip && (
            <div className="bg-[#F4A300]/10 rounded-2xl p-6 border border-[#F4A300]/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-[#F4A300]" />
                <div className="font-semibold text-[#0A2540] text-sm">Clinical Pearl 💡</div>
              </div>
              <p className="text-[#0A2540] text-sm leading-relaxed font-medium">{feedback.learning_tip}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => { setFeedback(null); setResponse('') }}>
              <RotateCcw size={16} /> Try Again
            </Button>
            <Button variant="primary" fullWidth onClick={() => navigate('/simulate')}>
              Next Scenario <ArrowLeft size={16} className="rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  )
}

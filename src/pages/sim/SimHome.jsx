import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Lock, ChevronRight, Zap, Target, Brain } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { TIER_LIMITS } from '../../lib/paystack'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

const DIFFICULTY_COLORS = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced:     'bg-red-100 text-red-700',
}

const CATEGORY_LABELS = {
  ctg: 'CTG Interpretation',
  obstetric_emergency: 'Obstetric Emergency',
  bls: 'Basic Life Support',
  neonatal: 'Neonatal',
}

// Seed scenarios for when DB is empty
const SEED_SCENARIOS = [
  {
    id: 'seed-1',
    title: 'The Sinusoidal Pattern — When to Act',
    category: 'ctg',
    difficulty: 'advanced',
    tier_required: 'nurse',
    patient_brief: 'A 38-week multigravida in active labour. Terbutaline given 90 mins ago for hyperstimulation. Patient is 7cm dilated. CTG at 06:30 shows sinusoidal pattern, baseline 130bpm. You are the midwife on duty.',
    scoring_rubric: '{"immediate_escalation":40,"urgency_classification":30,"documentation":15,"patient_communication":15}',
    correct_actions: '["Immediately call physician/registrar","Classify as pathological — sinusoidal is Category 3","Prepare for emergency C-section","Ensure IV access patent","Document time of recognition"]',
    teaching_points: 'Sinusoidal CTG is always pathological under NICE (2022). Associated with severe fetal anaemia including fetomaternal haemorrhage. Action is immediate — do not wait for scheduled review.',
  },
  {
    id: 'seed-2',
    title: 'Late Decelerations — Recognising UTI',
    category: 'ctg',
    difficulty: 'intermediate',
    tier_required: 'free',
    patient_brief: 'A 36-week primigravida in early labour, 4cm dilated. CTG shows late decelerations starting 30 seconds after each contraction peak, returning to baseline slowly. Baseline rate 145bpm, variability 10bpm. No accelerations in last 40 minutes.',
    scoring_rubric: '{"correct_classification":35,"escalation":35,"documentation":15,"positioning":15}',
    correct_actions: '["Classify as suspicious/pathological — late decelerations indicate uteroplacental insufficiency","Call senior midwife or obstetrician","Change maternal position to left lateral","Give IV fluids","Administer O2 if prescribed","Document every 15 minutes"]',
    teaching_points: 'Late decelerations begin after the peak of a contraction and indicate uteroplacental insufficiency. They are never normal. Under NICE, even a single late deceleration in a suspicious CTG warrants escalation.',
  },
  {
    id: 'seed-3',
    title: 'Normal CTG — Confirming Reassurance',
    category: 'ctg',
    difficulty: 'beginner',
    tier_required: 'free',
    patient_brief: 'A 39-week primigravida 3 hours into spontaneous labour. CTG shows: Baseline 140bpm. Variability 12bpm. Two accelerations in last 20 minutes. No decelerations. Contractions every 4 minutes.',
    scoring_rubric: '{"correct_classification":50,"appropriate_documentation":30,"action":20}',
    correct_actions: '["Classify as normal/reassuring CTG","Document findings clearly with time","Continue routine monitoring every 15-30 minutes","No escalation required","Reassure patient"]',
    teaching_points: 'A normal CTG has: Baseline 110-160bpm, variability 5-25bpm, accelerations present, no decelerations. Confidence in identifying a normal CTG is as clinically important as identifying pathology.',
  },
]

export default function SimHome() {
  const { profile, tier } = useAuth()
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [profile])

  async function loadData() {
    const [scenRes, sessRes] = await Promise.all([
      supabase.from('sim_scenarios').select('*').eq('is_published', true).order('sort_order'),
      supabase.from('sim_sessions').select('*, sim_scenarios(title)').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5),
    ])
    setScenarios(scenRes.data?.length ? scenRes.data : SEED_SCENARIOS)
    setSessions(sessRes.data || [])
    setLoading(false)
  }

  const limit = TIER_LIMITS[tier]?.sim_sessions || 3
  const used = profile?.sim_sessions_used || 0
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used)
  const hasSessionsLeft = remaining > 0

  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length)
    : null

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>ClinicalSim AI</h1>
        <p className="text-[#64748B] mt-1">Practice real patient scenarios. Get expert clinical feedback instantly.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-extrabold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>{sessions.length}</div>
          <div className="text-xs text-[#64748B] font-medium">Sessions Done</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-extrabold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>{avgScore !== null ? `${avgScore}%` : '—'}</div>
          <div className="text-xs text-[#64748B] font-medium">Avg Score</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-extrabold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {remaining === Infinity ? '∞' : remaining}
          </div>
          <div className="text-xs text-[#64748B] font-medium">Sessions Left</div>
        </div>
      </div>

      {/* Session usage */}
      {tier !== 'passport' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#0A2540]">Monthly sessions</span>
            <span className="text-xs text-[#64748B]">{used} / {limit} used</span>
          </div>
          <ProgressBar value={used} max={limit} color={remaining === 0 ? 'gold' : 'teal'} height="sm" showPercent={false} />
          {remaining === 0 && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-[#F57C00]">Session limit reached this month</p>
              <button onClick={() => navigate('/billing')} className="text-xs text-[#00897B] font-semibold hover:underline">Upgrade →</button>
            </div>
          )}
        </div>
      )}

      {/* Scenarios */}
      <h2 className="text-lg font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Available Scenarios</h2>
      <div className="space-y-3 mb-8">
        {(loading ? Array(3).fill(null) : scenarios).map((scenario, i) => {
          if (!scenario) return <div key={i} className="skeleton h-24 rounded-2xl" />
          const locked = !hasSessionsLeft || (scenario.tier_required !== 'free' && tier === 'free')
          const bestSession = sessions.find(s => s.scenario_id === scenario.id)

          return (
            <div key={scenario.id}
              onClick={() => !locked && navigate(`/simulate/${scenario.id}`, { state: { scenario } })}
              className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 transition-all
                ${locked ? 'opacity-70' : 'cursor-pointer hover:border-[#00897B]/30 hover:shadow-md'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                ${locked ? 'bg-gray-100' : 'bg-[#00897B]/10'}`}>
                {locked ? <Lock size={18} className="text-gray-400" /> : <Activity size={18} className="text-[#00897B]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#0A2540] text-sm leading-snug">{scenario.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#64748B]">{CATEGORY_LABELS[scenario.category] || scenario.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                  </div>
                  {bestSession && (
                    <div className={`text-sm font-bold flex-shrink-0 ${bestSession.score >= 70 ? 'text-[#00897B]' : 'text-[#F57C00]'}`}>
                      {bestSession.score}%
                    </div>
                  )}
                </div>
              </div>
              {!locked && <ChevronRight size={16} className="text-[#64748B] flex-shrink-0" />}
              {locked && scenario.tier_required !== 'free' && tier === 'free' && (
                <Button variant="gold" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>
                  Upgrade
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${s.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {s.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0A2540] truncate">{s.sim_scenarios?.title || 'Scenario'}</div>
                  <div className="text-xs text-[#64748B]">{new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {s.score >= 70 ? 'Passed' : 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  )
}

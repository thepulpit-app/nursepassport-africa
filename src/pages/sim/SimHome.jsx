import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Lock, ChevronRight, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { TIER_LIMITS } from '../../lib/paystack'
import AppShell from '../../components/layout/AppShell'

const DIFFICULTY_STYLES = {
  beginner:     { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', label: 'Beginner' },
  intermediate: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'Intermediate' },
  advanced:     { bg: '#FFF1F2', color: '#F43F5E', border: '#FECDD3', label: 'Advanced' },
}

const SEED_SCENARIOS = [
  { id: 'seed-1', title: 'The Sinusoidal Pattern — When to Act', category: 'ctg', difficulty: 'advanced', tier_required: 'nurse',
    patient_brief: 'A 38-week multigravida in active labour. Terbutaline given 90 mins ago. 7cm dilated. CTG shows sinusoidal pattern, baseline 130bpm.',
    scoring_rubric: '{"immediate_escalation":40,"urgency_classification":30,"documentation":15,"patient_communication":15}',
    correct_actions: '["Immediately call physician","Classify as pathological","Prepare for emergency C-section","Ensure IV access","Document time"]',
    teaching_points: 'Sinusoidal CTG is always pathological under NICE (2022). Associated with severe fetal anaemia.' },
  { id: 'seed-2', title: 'Late Decelerations — Recognising Uteroplacental Insufficiency', category: 'ctg', difficulty: 'intermediate', tier_required: 'free',
    patient_brief: 'A 36-week primigravida, 4cm dilated. CTG shows late decelerations starting 30 seconds after each contraction peak. Baseline 145bpm, variability 10bpm.',
    scoring_rubric: '{"correct_classification":35,"escalation":35,"documentation":15,"positioning":15}',
    correct_actions: '["Classify as suspicious/pathological","Call senior midwife","Change to left lateral","Give IV fluids","Document"]',
    teaching_points: 'Late decelerations begin after the contraction peak and indicate uteroplacental insufficiency. Never normal.' },
  { id: 'seed-3', title: 'Normal CTG — Confirming Reassurance', category: 'ctg', difficulty: 'beginner', tier_required: 'free',
    patient_brief: 'A 39-week primigravida, 3 hours into labour. CTG: Baseline 140bpm, variability 12bpm, 2 accelerations in 20 mins, no decelerations.',
    scoring_rubric: '{"correct_classification":50,"documentation":30,"action":20}',
    correct_actions: '["Classify as normal/reassuring","Document clearly","Continue routine monitoring","No escalation","Reassure patient"]',
    teaching_points: 'Normal CTG: 110-160bpm baseline, 5-25bpm variability, accelerations present, no decelerations.' },
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
  const avgScore = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length) : null

  return (
    <AppShell>
      <style>{`
        .sim-hero { background: linear-gradient(135deg, #F43F5E, #EC4899); border-radius: 20px; padding: 22px; color: white; margin-bottom: 20px; }
        .sim-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .sim-stat { background: white; border-radius: 14px; padding: 14px; text-align: center; border: 1px solid #F1F5F9; }
        .scenario-card { background: white; border-radius: 16px; border: 1px solid #F1F5F9; padding: 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .scenario-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .session-row { background: white; border-radius: 12px; border: 1px solid #F1F5F9; padding: 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .pbar-bg { background: rgba(255,255,255,0.25); border-radius: 99px; height: 5px; overflow: hidden; margin: 10px 0; }
        .pbar-fill { background: white; height: 100%; border-radius: 99px; }
      `}</style>

      {/* Hero */}
      <div className="sim-hero">
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🩺</div>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '800', margin: '0 0 6px' }}>ClinicalSim AI</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: '0 0 14px', lineHeight: 1.5 }}>
          Practice real patient scenarios. Get expert clinical feedback powered by AI trained on NICE & RCOG guidelines.
        </p>
        <div className="pbar-bg">
          <div className="pbar-fill" style={{ width: limit === Infinity ? '30%' : `${Math.min(100, (used / limit) * 100)}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
            {limit === Infinity ? 'Unlimited sessions' : `${remaining} of ${limit} sessions remaining`}
          </span>
          {tier !== 'passport' && (
            <button onClick={() => navigate('/billing')}
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '8px', padding: '5px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              Get More
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="sim-stats">
        <div className="sim-stat">
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A2540' }}>{sessions.length}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginTop: '2px' }}>SESSIONS</div>
        </div>
        <div className="sim-stat">
          <div style={{ fontSize: '22px', fontWeight: '800', color: avgScore !== null ? (avgScore >= 70 ? '#22C55E' : '#F59E0B') : '#94A3B8' }}>
            {avgScore !== null ? `${avgScore}%` : '—'}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginTop: '2px' }}>AVG SCORE</div>
        </div>
        <div className="sim-stat">
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#7C3AED' }}>
            {remaining === Infinity ? '∞' : remaining}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginTop: '2px' }}>LEFT</div>
        </div>
      </div>

      {/* Scenarios */}
      <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>Available Scenarios</h2>

      {(loading ? Array(3).fill(null) : scenarios).map((scenario, i) => {
        if (!scenario) return <div key={i} style={{ height: '80px', background: '#F1F5F9', borderRadius: '16px', marginBottom: '10px' }} />
        const locked = remaining === 0 || (scenario.tier_required !== 'free' && tier === 'free')
        const diff = DIFFICULTY_STYLES[scenario.difficulty] || DIFFICULTY_STYLES.beginner
        const bestSession = sessions.find(s => s.scenario_id === scenario.id)

        return (
          <div key={scenario.id} className="scenario-card"
            style={{ opacity: locked ? 0.7 : 1 }}
            onClick={() => !locked && navigate(`/simulate/${scenario.id}`, { state: { scenario } })}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: locked ? '#F1F5F9' : 'linear-gradient(135deg, #F43F5E, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {locked ? <Lock size={18} color="#94A3B8" /> : <Activity size={18} color="white" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px', marginBottom: '4px', lineHeight: '1.3' }}>{scenario.title}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '99px', background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                  {diff.label}
                </span>
                {bestSession && (
                  <span style={{ fontSize: '11px', fontWeight: '700', color: bestSession.score >= 70 ? '#22C55E' : '#F59E0B' }}>
                    Best: {bestSession.score}%
                  </span>
                )}
              </div>
            </div>
            {locked && scenario.tier_required !== 'free' && tier === 'free' ? (
              <button style={{ background: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); navigate('/billing') }}>
                Upgrade
              </button>
            ) : !locked ? (
              <ChevronRight size={18} color="#CBD5E1" style={{ flexShrink: 0 }} />
            ) : null}
          </div>
        )
      })}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '24px 0 14px' }}>Recent Sessions</h2>
          {sessions.map((s, i) => (
            <div key={i} className="session-row">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.score >= 70 ? '#F0FDF4' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: s.score >= 70 ? '#22C55E' : '#F59E0B' }}>{s.score}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.sim_scenarios?.title || 'Scenario'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', background: s.score >= 70 ? '#F0FDF4' : '#FFFBEB', color: s.score >= 70 ? '#22C55E' : '#F59E0B', flexShrink: 0 }}>
                {s.score >= 70 ? '✓ Passed' : 'Review'}
              </div>
            </div>
          ))}
        </>
      )}
    </AppShell>
  )
}

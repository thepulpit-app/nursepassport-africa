import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
const TIERS = ['free', 'nurse', 'passport']
const CATEGORIES = ['ctg', 'obstetric', 'bls', 'osce', 'general']

const DIFF_COLORS = {
  beginner: { bg: '#F0FDF4', color: '#22C55E' },
  intermediate: { bg: '#FFFBEB', color: '#F59E0B' },
  advanced: { bg: '#FFF1F2', color: '#F43F5E' },
}

export default function AdminScenarios() {
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadScenarios() }, [])

  async function loadScenarios() {
    const { data } = await supabase.from('sim_scenarios').select('*').order('sort_order')
    setScenarios(data || [])
    setLoading(false)
  }

  async function saveScenario() {
    if (!editing.title || !editing.patient_brief) { setMsg('Title and patient brief are required'); return }
    setSaving(true)
    setMsg('')
    try {
      if (editing.id) {
        const { error } = await supabase.from('sim_scenarios').update({
          title: editing.title,
          category: editing.category,
          difficulty: editing.difficulty,
          tier_required: editing.tier_required,
          patient_brief: editing.patient_brief,
          scoring_rubric: editing.scoring_rubric,
          correct_actions: editing.correct_actions,
          teaching_points: editing.teaching_points,
          sort_order: editing.sort_order,
          is_published: editing.is_published,
        }).eq('id', editing.id)
        if (error) throw error
        setScenarios(s => s.map(x => x.id === editing.id ? { ...x, ...editing } : x))
      } else {
        const { data, error } = await supabase.from('sim_scenarios').insert({
          title: editing.title,
          category: editing.category,
          difficulty: editing.difficulty,
          tier_required: editing.tier_required,
          patient_brief: editing.patient_brief,
          scoring_rubric: editing.scoring_rubric,
          correct_actions: editing.correct_actions,
          teaching_points: editing.teaching_points,
          sort_order: editing.sort_order || scenarios.length + 1,
          is_published: editing.is_published || false,
        }).select().single()
        if (error) throw error
        setScenarios(s => [...s, data])
      }
      setEditing(null)
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
  }

  async function togglePublish(scenario) {
    await supabase.from('sim_scenarios').update({ is_published: !scenario.is_published }).eq('id', scenario.id)
    setScenarios(s => s.map(x => x.id === scenario.id ? { ...x, is_published: !x.is_published } : x))
  }

  async function deleteScenario(id) {
    if (!window.confirm('Delete this scenario?')) return
    await supabase.from('sim_scenarios').delete().eq('id', id)
    setScenarios(s => s.filter(x => x.id !== id))
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }
  const LABEL = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }

  const filtered = filter === 'all' ? scenarios : scenarios.filter(s => s.category === filter)

  const CATEGORY_LABELS = { ctg: 'CTG', obstetric: 'Obstetrics', bls: 'BLS', osce: 'OSCE', general: 'General' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: 0 }}>
          ClinicalSim Scenarios ({scenarios.length})
        </h1>
        <button onClick={() => { setMsg(''); setEditing({ title: '', category: 'ctg', difficulty: 'beginner', tier_required: 'free', patient_brief: '', scoring_rubric: '', correct_actions: '', teaching_points: '', sort_order: scenarios.length + 1, is_published: false }) }}
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
          + Add Scenario
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: filter === cat ? '#4F46E5' : '#F1F5F9', color: filter === cat ? 'white' : '#64748B' }}>
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {loading ? <div style={{ color: '#94A3B8' }}>Loading...</div> : (
        <div>
          {filtered.map(scenario => {
            const diff = DIFF_COLORS[scenario.difficulty] || DIFF_COLORS.beginner
            return (
              <div key={scenario.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '16px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0A2540' }}>{scenario.title}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: diff.bg, color: diff.color }}>{scenario.difficulty}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: '#F1F5F9', color: '#64748B' }}>{CATEGORY_LABELS[scenario.category] || scenario.category}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: '#EEF2FF', color: '#4F46E5' }}>{scenario.tier_required}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {scenario.patient_brief?.substring(0, 100)}...
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => togglePublish(scenario)}
                    style={{ padding: '6px 12px', background: scenario.is_published ? '#F0FDF4' : '#F8FAFC', border: '1px solid ' + (scenario.is_published ? '#BBF7D0' : '#E2E8F0'), borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: scenario.is_published ? '#22C55E' : '#94A3B8' }}>
                    {scenario.is_published ? '✅ Live' : '⏸ Draft'}
                  </button>
                  <button onClick={() => { setMsg(''); setEditing({ ...scenario }) }}
                    style={{ padding: '6px 12px', background: '#EEF2FF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#4F46E5' }}>Edit</button>
                  <button onClick={() => deleteScenario(scenario.id)}
                    style={{ padding: '6px 12px', background: '#FFF1F2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#F43F5E' }}>Del</button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <div style={{ color: '#94A3B8', fontSize: '13px', padding: '20px 0' }}>No scenarios in this category yet.</div>}
        </div>
      )}

      {/* Scenario Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editing.id ? 'Edit Scenario' : 'New Scenario'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#94A3B8' }}>x</button>
            </div>
            {msg && <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '10px 14px', color: '#F43F5E', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={LABEL}>Title *</label><input value={editing.title} onChange={e => setEditing(x => ({ ...x, title: e.target.value }))} placeholder="e.g. Sinusoidal Pattern — When to Act" style={INPUT} /></div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div><label style={LABEL}>Category</label>
                  <select value={editing.category} onChange={e => setEditing(x => ({ ...x, category: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
                  </select>
                </div>
                <div><label style={LABEL}>Difficulty</label>
                  <select value={editing.difficulty} onChange={e => setEditing(x => ({ ...x, difficulty: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label style={LABEL}>Tier Required</label>
                  <select value={editing.tier_required} onChange={e => setEditing(x => ({ ...x, tier_required: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                    {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={LABEL}>Patient Brief * — what the nurse reads before responding</label>
                <textarea value={editing.patient_brief || ''} onChange={e => setEditing(x => ({ ...x, patient_brief: e.target.value }))} rows={5} style={{ ...INPUT, resize: 'vertical', lineHeight: '1.6' }} placeholder="You are the midwife on duty. A 32-year-old G2P1 at 38 weeks is on continuous CTG monitoring. The trace shows..." />
              </div>

              <div>
                <label style={LABEL}>Scoring Rubric — what the AI scores the nurse against</label>
                <textarea value={editing.scoring_rubric || ''} onChange={e => setEditing(x => ({ ...x, scoring_rubric: e.target.value }))} rows={4} style={{ ...INPUT, resize: 'vertical', lineHeight: '1.6' }} placeholder="Score 100 if nurse identifies all 4 features correctly and escalates immediately. Score 60-80 if..." />
              </div>

              <div>
                <label style={LABEL}>Correct Clinical Actions — the model answer</label>
                <textarea value={editing.correct_actions || ''} onChange={e => setEditing(x => ({ ...x, correct_actions: e.target.value }))} rows={4} style={{ ...INPUT, resize: 'vertical', lineHeight: '1.6' }} placeholder="1. Immediately call the registrar/consultant\n2. Classify CTG as pathological\n3. Prepare for emergency C-section..." />
              </div>

              <div>
                <label style={LABEL}>Teaching Points — what the nurse should learn</label>
                <textarea value={editing.teaching_points || ''} onChange={e => setEditing(x => ({ ...x, teaching_points: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical', lineHeight: '1.6' }} placeholder="A sinusoidal pattern is always pathological and requires immediate senior review..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LABEL}>Sort Order</label><input type="number" value={editing.sort_order || 1} onChange={e => setEditing(x => ({ ...x, sort_order: parseInt(e.target.value) }))} style={INPUT} /></div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!editing.is_published} onChange={e => setEditing(x => ({ ...x, is_published: e.target.checked }))} style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>Published (visible to users)</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '13px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveScenario} disabled={saving} style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Scenario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

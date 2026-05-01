import { useEffect, useState } from 'react'
import { Plus, Edit2, Eye, EyeOff, Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminShell from './AdminShell'
import toast from 'react-hot-toast'

export default function AdminScenarios() {
  const [scenarios, setScenarios] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadScenarios() }, [])

  async function loadScenarios() {
    const { data } = await supabase.from('sim_scenarios').select('*').order('sort_order')
    setScenarios(data || [])
    setLoading(false)
  }

  async function saveScenario(s) {
    if (s.id) {
      await supabase.from('sim_scenarios').update(s).eq('id', s.id)
      setScenarios(prev => prev.map(x => x.id === s.id ? s : x))
    } else {
      const { data } = await supabase.from('sim_scenarios').insert(s).select().single()
      setScenarios(prev => [...prev, data])
    }
    toast.success('Scenario saved')
    setEditing(null)
  }

  async function togglePublish(s) {
    await supabase.from('sim_scenarios').update({ is_published: !s.is_published }).eq('id', s.id)
    setScenarios(prev => prev.map(x => x.id === s.id ? { ...x, is_published: !x.is_published } : x))
    toast.success(s.is_published ? 'Unpublished' : 'Published')
  }

  const DIFF_COLORS = { beginner: '#22C55E', intermediate: '#F59E0B', advanced: '#F43F5E' }

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>ClinicalSim Scenarios</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>{scenarios.length} scenarios · Add your wife's clinical cases here</p>
        </div>
        <button onClick={() => setEditing({ title: '', category: 'ctg', difficulty: 'intermediate', tier_required: 'free', patient_brief: '', scoring_rubric: '{}', correct_actions: '[]', teaching_points: '', is_published: false, sort_order: scenarios.length + 1 })}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Scenario
        </button>
      </div>

      {loading ? (
        <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '16px' }} />
      ) : scenarios.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🩺</div>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>No scenarios yet. Add your wife's clinical cases to get started.</p>
          <button onClick={() => setEditing({ title: '', category: 'ctg', difficulty: 'intermediate', tier_required: 'free', patient_brief: '', scoring_rubric: '{}', correct_actions: '[]', teaching_points: '', is_published: false, sort_order: 1 })}
            style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', cursor: 'pointer' }}>
            Add First Scenario
          </button>
        </div>
      ) : (
        scenarios.map((s, i) => (
          <div key={s.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #F1F5F9', padding: '16px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DIFF_COLORS[s.difficulty] || '#94A3B8', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px', marginBottom: '3px' }}>{s.title}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{s.category} · {s.difficulty} · {s.tier_required}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: s.is_published ? '#22C55E' : '#94A3B8' }}>{s.is_published ? '● Live' : '○ Draft'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => togglePublish(s)}
                style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                {s.is_published ? <EyeOff size={11} /> : <Eye size={11} />}
              </button>
              <button onClick={() => setEditing({ ...s })}
                style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Edit2 size={11} /> Edit
              </button>
            </div>
          </div>
        ))
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editing.id ? 'Edit Scenario' : 'New Scenario'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Title</label>
                <input value={editing.title} onChange={e => setEditing(s => ({ ...s, title: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { key: 'category', label: 'Category', opts: ['ctg', 'obstetric_emergency', 'bls', 'neonatal'] },
                  { key: 'difficulty', label: 'Difficulty', opts: ['beginner', 'intermediate', 'advanced'] },
                  { key: 'tier_required', label: 'Tier', opts: ['free', 'nurse', 'passport'] },
                ].map(({ key, label, opts }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</label>
                    <select value={editing[key]} onChange={e => setEditing(s => ({ ...s, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', background: 'white', color: '#0A2540', boxSizing: 'border-box' }}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              {[
                { key: 'patient_brief', label: 'Patient Brief (shown to nurse)', rows: 4 },
                { key: 'correct_actions', label: 'Correct Actions (JSON array)', rows: 3 },
                { key: 'scoring_rubric', label: 'Scoring Rubric (JSON object)', rows: 3 },
                { key: 'teaching_points', label: 'Teaching Points', rows: 3 },
              ].map(({ key, label, rows }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</label>
                  <textarea value={editing[key] || ''} onChange={e => setEditing(s => ({ ...s, [key]: e.target.value }))} rows={rows}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: key.includes('rubric') || key.includes('actions') ? 'monospace' : 'inherit', boxSizing: 'border-box', color: '#0A2540' }} />
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={editing.is_published} onChange={e => setEditing(s => ({ ...s, is_published: e.target.checked }))} id="pub" />
                <label htmlFor="pub" style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540', cursor: 'pointer' }}>Published</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditing(null)}
                style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#64748B', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => saveScenario(editing)}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

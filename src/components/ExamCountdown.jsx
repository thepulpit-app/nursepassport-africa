import { useState } from 'react'
import { supabase } from '../lib/supabase'

const EXAM_TYPES = [
  { key: 'nclex', label: 'NCLEX-RN 🇺🇸', color: '#4F46E5' },
  { key: 'nmc', label: 'NMC CBT 🇬🇧', color: '#0891B2' },
  { key: 'haad', label: 'HAAD/DHA 🇦🇪', color: '#059669' },
  { key: 'osce', label: 'NMC OSCE 🇬🇧', color: '#7C3AED' },
  { key: 'nmbn', label: 'NMBN 🇳🇬', color: '#DC2626' },
]

export default function ExamCountdown({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [examType, setExamType] = useState(profile?.exam_type || '')
  const [examDate, setExamDate] = useState(profile?.exam_date || '')
  const [saving, setSaving] = useState(false)

  const exam = EXAM_TYPES.find(e => e.key === (profile?.exam_type || examType))
  const daysLeft = profile?.exam_date
    ? Math.ceil((new Date(profile.exam_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  async function saveExam() {
    setSaving(true)
    await supabase.from('profiles').update({
      exam_type: examType,
      exam_date: examDate,
    }).eq('id', profile.id)
    setSaving(false)
    setEditing(false)
    onUpdate?.()
  }

  if (!profile?.exam_date && !editing) {
    return (
      <div style={{ background: '#EEF2FF', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1.5px dashed #C7D2FE', cursor: 'pointer' }}
        onClick={() => setEditing(true)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>📅</div>
          <div>
            <div style={{ fontWeight: '700', color: '#4F46E5', fontSize: '13px' }}>Set your exam date</div>
            <div style={{ color: '#94A3B8', fontSize: '11px' }}>Get a personalised countdown and study plan</div>
          </div>
        </div>
      </div>
    )
  }

  if (editing) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '14px', marginBottom: '12px' }}>📅 Set Your Exam Target</div>
        <select value={examType} onChange={e => setExamType(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', marginBottom: '10px', color: '#0A2540' }}>
          <option value="">Select your exam</option>
          {EXAM_TYPES.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
        </select>
        <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', marginBottom: '12px', boxSizing: 'border-box', color: '#0A2540' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={saveExam} disabled={!examType || !examDate || saving}
            style={{ flex: 1, padding: '10px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Target'}
          </button>
          <button onClick={() => setEditing(false)}
            style={{ padding: '10px 16px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const urgent = daysLeft !== null && daysLeft <= 30
  const passed = daysLeft !== null && daysLeft < 0

  return (
    <div style={{ background: passed ? '#F1F5F9' : `linear-gradient(135deg, ${exam?.color || '#4F46E5'}, ${exam?.color || '#4F46E5'}dd)`, borderRadius: '16px', padding: '16px', marginBottom: '16px', cursor: 'pointer' }}
      onClick={() => setEditing(true)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '10px', color: passed ? '#94A3B8' : 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            {passed ? 'Exam Date Passed' : '📅 Exam Countdown'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: passed ? '#64748B' : 'white', marginBottom: '2px' }}>{exam?.label}</div>
          <div style={{ fontSize: '11px', color: passed ? '#94A3B8' : 'rgba(255,255,255,0.7)' }}>
            {new Date(profile.exam_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: '900', color: passed ? '#94A3B8' : 'white', lineHeight: 1 }}>
            {passed ? '✓' : Math.abs(daysLeft)}
          </div>
          <div style={{ fontSize: '10px', color: passed ? '#94A3B8' : 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
            {passed ? 'COMPLETED' : 'DAYS LEFT'}
          </div>
        </div>
      </div>
      {!passed && urgent && (
        <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: 'white' }}>
          ⚡ {daysLeft <= 7 ? 'Final week! Focus on weak areas.' : 'Under 30 days — increase your practice frequency.'}
        </div>
      )}
      {!passed && !urgent && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Tap to update your exam date</div>
      )}
    </div>
  )
}

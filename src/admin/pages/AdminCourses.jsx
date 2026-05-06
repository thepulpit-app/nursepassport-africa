import { useEffect, useState } from 'react'
import { Plus, Edit2, Eye, EyeOff, ChevronDown, ChevronUp, Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

import toast from 'react-hot-toast'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [modules, setModules] = useState({})
  const [editingModule, setEditingModule] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCourses() }, [])

  async function loadCourses() {
    const { data } = await supabase.from('courses').select('*').order('sort_order')
    setCourses(data || [])
    setLoading(false)
  }

  async function loadModules(courseId) {
    if (modules[courseId]) return
    const { data } = await supabase.from('modules').select('*').eq('course_id', courseId).order('sort_order')
    setModules(m => ({ ...m, [courseId]: data || [] }))
  }

  async function toggleExpand(courseId) {
    if (expanded === courseId) { setExpanded(null); return }
    setExpanded(courseId)
    await loadModules(courseId)
  }

  async function togglePublish(course) {
    await supabase.from('courses').update({ is_published: !course.is_published }).eq('id', course.id)
    setCourses(c => c.map(x => x.id === course.id ? { ...x, is_published: !x.is_published } : x))
    toast.success(course.is_published ? 'Course unpublished' : 'Course published')
  }

  async function saveModule(mod) {
    if (mod.id) {
      await supabase.from('modules').update({ title: mod.title, description: mod.description, reading_content: mod.reading_content, video_url: mod.video_url, estimated_minutes: mod.estimated_minutes, tier_required: mod.tier_required, is_published: mod.is_published }).eq('id', mod.id)
      setModules(m => ({ ...m, [mod.course_id]: m[mod.course_id]?.map(x => x.id === mod.id ? mod : x) || [] }))
    } else {
      const { data } = await supabase.from('modules').insert({ ...mod }).select().single()
      setModules(m => ({ ...m, [mod.course_id]: [...(m[mod.course_id] || []), data] }))
    }
    toast.success('Module saved')
    setEditingModule(null)
  }

  const TIER_COLORS = { free: '#22C55E', nurse: '#4F46E5', passport: '#F59E0B' }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Courses</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Manage course content and modules</p>
      </div>

      {loading ? (
        <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '16px' }} />
      ) : courses.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>No courses yet. Add courses via the Supabase Table Editor first.</p>
        </div>
      ) : (
        courses.map(course => (
          <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px', overflow: 'hidden' }}>
            {/* Course header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px', marginBottom: '2px' }}>{course.title}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: course.is_published ? '#F0FDF4' : '#F8FAFC', color: course.is_published ? '#22C55E' : '#94A3B8', fontWeight: '700' }}>
                    {course.is_published ? '● Live' : '○ Draft'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{course.slug}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => togglePublish(course)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#64748B' }}>
                  {course.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
                  {course.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => toggleExpand(course.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#64748B' }}>
                  {expanded === course.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  Modules
                </button>
              </div>
            </div>

            {/* Modules */}
            {expanded === course.id && (
              <div style={{ borderTop: '1px solid #F1F5F9', padding: '16px 20px' }}>
                {(modules[course.id] || []).map(mod => (
                  <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TIER_COLORS[mod.tier_required] || '#94A3B8', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{mod.title}</div>
                      <div style={{ color: '#94A3B8', fontSize: '11px' }}>
                        {mod.tier_required} · {mod.estimated_minutes} min · {mod.is_published ? '✓ Published' : '○ Draft'}
                      </div>
                    </div>
                    <button onClick={() => setEditingModule({ ...mod })}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: '#64748B' }}>
                      <Edit2 size={11} /> Edit
                    </button>
                  </div>
                ))}
                <button onClick={() => setEditingModule({ course_id: course.id, title: '', description: '', reading_content: '', video_url: '', estimated_minutes: 45, tier_required: 'nurse', sort_order: (modules[course.id]?.length || 0) + 1, is_published: false })}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1.5px dashed #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4F46E5', width: '100%', justifyContent: 'center' }}>
                  <Plus size={14} /> Add Module
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Edit Module Modal */}
      {editingModule && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '560px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editingModule.id ? 'Edit Module' : 'Add Module'}</h2>
              <button onClick={() => setEditingModule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'title', label: 'Module Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'video_url', label: 'Video URL (Bunny.net)', type: 'text' },
                { key: 'estimated_minutes', label: 'Duration (minutes)', type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</label>
                  <input type={type} value={editingModule[key] || ''} onChange={e => setEditingModule(m => ({ ...m, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Tier Required</label>
                <select value={editingModule.tier_required} onChange={e => setEditingModule(m => ({ ...m, tier_required: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#0A2540' }}>
                  <option value="free">Free</option>
                  <option value="nurse">Nurse</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Reading Content (Markdown)</label>
                <textarea value={editingModule.reading_content || ''} onChange={e => setEditingModule(m => ({ ...m, reading_content: e.target.value }))} rows={8}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace', color: '#0A2540' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={editingModule.is_published} onChange={e => setEditingModule(m => ({ ...m, is_published: e.target.checked }))} id="published" />
                <label htmlFor="published" style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540', cursor: 'pointer' }}>Published (visible to nurses)</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditingModule(null)}
                style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => saveModule(editingModule)}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Save size={14} /> Save Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

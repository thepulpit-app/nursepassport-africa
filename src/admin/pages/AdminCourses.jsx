import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState({})
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingModule, setEditingModule] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

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

  async function saveCourse() {
    if (!editingCourse.title || !editingCourse.slug) { setMsg('Title and slug are required'); return }
    setSaving(true)
    setMsg('')
    try {
      if (editingCourse.id) {
        const { error } = await supabase.from('courses').update({
          title: editingCourse.title,
          description: editingCourse.description,
          slug: editingCourse.slug,
          estimated_hours: editingCourse.estimated_hours,
          is_published: editingCourse.is_published,
          sort_order: editingCourse.sort_order,
        }).eq('id', editingCourse.id)
        if (error) throw error
        setCourses(c => c.map(x => x.id === editingCourse.id ? { ...x, ...editingCourse } : x))
      } else {
        const { data, error } = await supabase.from('courses').insert({
          title: editingCourse.title,
          description: editingCourse.description,
          slug: editingCourse.slug,
          estimated_hours: editingCourse.estimated_hours,
          is_published: editingCourse.is_published,
          sort_order: editingCourse.sort_order,
        }).select().single()
        if (error) throw error
        setCourses(c => [...c, data])
      }
      setEditingCourse(null)
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
  }

  async function deleteCourse(courseId) {
    if (!window.confirm('Delete this course and all its modules?')) return
    await supabase.from('modules').delete().eq('course_id', courseId)
    await supabase.from('courses').delete().eq('id', courseId)
    setCourses(c => c.filter(x => x.id !== courseId))
  }

  async function saveModule() {
    if (!editingModule.title) { setMsg('Module title is required'); return }
    setSaving(true)
    setMsg('')
    try {
      if (editingModule.id) {
        const { error } = await supabase.from('modules').update({
          title: editingModule.title,
          description: editingModule.description,
          reading_content: editingModule.reading_content,
          video_url: editingModule.video_url,
          estimated_minutes: editingModule.estimated_minutes,
          tier_required: editingModule.tier_required,
          sort_order: editingModule.sort_order,
          is_published: editingModule.is_published,
        }).eq('id', editingModule.id)
        if (error) throw error
        setModules(m => ({ ...m, [editingModule.course_id]: m[editingModule.course_id]?.map(mod => mod.id === editingModule.id ? { ...mod, ...editingModule } : mod) || [] }))
      } else {
        const { data, error } = await supabase.from('modules').insert({
          course_id: editingModule.course_id,
          title: editingModule.title,
          description: editingModule.description,
          reading_content: editingModule.reading_content,
          video_url: editingModule.video_url,
          estimated_minutes: editingModule.estimated_minutes,
          tier_required: editingModule.tier_required,
          sort_order: editingModule.sort_order,
          is_published: editingModule.is_published,
        }).select().single()
        if (error) throw error
        setModules(m => ({ ...m, [editingModule.course_id]: [...(m[editingModule.course_id] || []), data] }))
      }
      setEditingModule(null)
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }
  const LABEL = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Courses</h1>
        <button onClick={() => { setMsg(''); setEditingCourse({ title: '', description: '', slug: '', estimated_hours: 1, is_published: false, sort_order: courses.length + 1 }) }}
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
          + Add Course
        </button>
      </div>

      {loading ? <div style={{ color: '#94A3B8' }}>Loading...</div> : courses.map(course => (
        <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={async () => {
              if (expanded === course.id) { setExpanded(null); return }
              setExpanded(course.id)
              await loadModules(course.id)
            }}>
              <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>{course.title}</div>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>{course.is_published ? '✅ Published' : '⏸ Draft'} · {course.estimated_hours}h</div>
            </div>
            <button onClick={() => { setMsg(''); setEditingCourse({ ...course }) }}
              style={{ padding: '6px 12px', background: '#EEF2FF', border: 'none', borderRadius: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => deleteCourse(course.id)}
              style={{ padding: '6px 12px', background: '#FFF1F2', border: 'none', borderRadius: '8px', color: '#F43F5E', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
            <span style={{ cursor: 'pointer', fontSize: '16px', color: '#94A3B8' }} onClick={async () => {
              if (expanded === course.id) { setExpanded(null); return }
              setExpanded(course.id)
              await loadModules(course.id)
            }}>{expanded === course.id ? '▼' : '▶'}</span>
          </div>

          {expanded === course.id && (
            <div style={{ borderTop: '1px solid #F8FAFC', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Modules ({(modules[course.id] || []).length})</span>
                <button onClick={() => { setMsg(''); setEditingModule({ course_id: course.id, title: '', description: '', reading_content: '', video_url: '', estimated_minutes: 45, tier_required: 'nurse', sort_order: (modules[course.id]?.length || 0) + 1, is_published: false }) }}
                  style={{ padding: '6px 12px', background: '#EEF2FF', border: 'none', borderRadius: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                  + Add Module
                </button>
              </div>
              {(modules[course.id] || []).length === 0 && <div style={{ color: '#94A3B8', fontSize: '13px' }}>No modules yet</div>}
              {(modules[course.id] || []).map(mod => (
                <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#0A2540', fontSize: '13px' }}>{mod.title}</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>{mod.tier_required} · {mod.estimated_minutes}min · {mod.is_published ? '✅' : '⏸'}</div>
                  </div>
                  <button onClick={() => { setMsg(''); setEditingModule({ ...mod }) }}
                    style={{ padding: '6px 10px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Course Modal */}
      {editingCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editingCourse.id ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setEditingCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#94A3B8', lineHeight: 1 }}>x</button>
            </div>
            {msg && <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '10px 14px', color: '#F43F5E', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={LABEL}>Title *</label>
                <input value={editingCourse.title} onChange={e => setEditingCourse(x => ({ ...x, title: e.target.value }))} placeholder="e.g. CTG Interpretation Masterclass" style={INPUT} />
              </div>
              <div>
                <label style={LABEL}>Description</label>
                <textarea value={editingCourse.description || ''} onChange={e => setEditingCourse(x => ({ ...x, description: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} />
              </div>
              <div>
                <label style={LABEL}>Slug (URL) *</label>
                <input value={editingCourse.slug || ''} onChange={e => setEditingCourse(x => ({ ...x, slug: e.target.value }))} placeholder="e.g. ctg-interpretation" style={INPUT} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={LABEL}>Estimated Hours</label>
                  <input type="number" step="0.5" value={editingCourse.estimated_hours || 1} onChange={e => setEditingCourse(x => ({ ...x, estimated_hours: parseFloat(e.target.value) }))} style={INPUT} />
                </div>
                <div>
                  <label style={LABEL}>Sort Order</label>
                  <input type="number" value={editingCourse.sort_order || 1} onChange={e => setEditingCourse(x => ({ ...x, sort_order: parseInt(e.target.value) }))} style={INPUT} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!editingCourse.is_published} onChange={e => setEditingCourse(x => ({ ...x, is_published: e.target.checked }))} style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>Published (visible to users)</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditingCourse(null)} style={{ flex: 1, padding: '13px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveCourse} disabled={saving} style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {editingModule && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editingModule.id ? 'Edit Module' : 'New Module'}</h2>
              <button onClick={() => setEditingModule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#94A3B8', lineHeight: 1 }}>x</button>
            </div>
            {msg && <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '10px 14px', color: '#F43F5E', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={LABEL}>Title *</label>
                <input value={editingModule.title} onChange={e => setEditingModule(x => ({ ...x, title: e.target.value }))} placeholder="e.g. CTG Fundamentals" style={INPUT} />
              </div>
              <div>
                <label style={LABEL}>Description</label>
                <textarea value={editingModule.description || ''} onChange={e => setEditingModule(x => ({ ...x, description: e.target.value }))} rows={2} style={{ ...INPUT, resize: 'vertical' }} />
              </div>
              <div>
                <label style={LABEL}>Reading Content</label>
                <textarea value={editingModule.reading_content || ''} onChange={e => setEditingModule(x => ({ ...x, reading_content: e.target.value }))} rows={10} style={{ ...INPUT, resize: 'vertical', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5' }} placeholder="Paste the full module content here..." />
              </div>
              <div>
                <label style={LABEL}>Video URL</label>
                <input value={editingModule.video_url || ''} onChange={e => setEditingModule(x => ({ ...x, video_url: e.target.value }))} placeholder="https://youtube.com/embed/..." style={INPUT} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={LABEL}>Duration (mins)</label>
                  <input type="number" value={editingModule.estimated_minutes || 45} onChange={e => setEditingModule(x => ({ ...x, estimated_minutes: parseInt(e.target.value) }))} style={INPUT} />
                </div>
                <div>
                  <label style={LABEL}>Tier Required</label>
                  <select value={editingModule.tier_required || 'nurse'} onChange={e => setEditingModule(x => ({ ...x, tier_required: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                    {['free', 'student', 'nurse', 'passport'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={LABEL}>Sort Order</label>
                  <input type="number" value={editingModule.sort_order || 1} onChange={e => setEditingModule(x => ({ ...x, sort_order: parseInt(e.target.value) }))} style={INPUT} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!editingModule.is_published} onChange={e => setEditingModule(x => ({ ...x, is_published: e.target.checked }))} style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>Published</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditingModule(null)} style={{ flex: 1, padding: '13px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveModule} disabled={saving} style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Module'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

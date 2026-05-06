const fs = require('fs')

// Fix AdminQuizQuestions - the expand/load logic
fs.writeFileSync('src/admin/pages/AdminQuizQuestions.jsx', `import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminQuizQuestions() {
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState({})
  const [questions, setQuestions] = useState({})
  const [quizzes, setQuizzes] = useState({})
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [expandedModule, setExpandedModule] = useState(null)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('courses').select('*').order('sort_order').then(({ data }) => {
      setCourses(data || [])
      setLoading(false)
    })
  }, [])

  async function loadModules(courseId) {
    if (modules[courseId]) return
    const { data } = await supabase.from('modules').select('*').eq('course_id', courseId).order('sort_order')
    setModules(m => ({ ...m, [courseId]: data || [] }))
  }

  async function loadQuestions(moduleId) {
    const { data: quizData } = await supabase.from('quizzes').select('*').eq('module_id', moduleId).single()
    if (quizData) {
      setQuizzes(q => ({ ...q, [moduleId]: quizData }))
      const { data: qData } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.id).order('created_at')
      setQuestions(q => ({ ...q, [moduleId]: qData || [] }))
    } else {
      setQuestions(q => ({ ...q, [moduleId]: [] }))
    }
  }

  async function saveQuestion(q, moduleId) {
    let quizId = quizzes[moduleId]?.id
    if (!quizId) {
      const { data } = await supabase.from('quizzes').insert({ module_id: moduleId, pass_score: 70 }).select().single()
      quizId = data.id
      setQuizzes(qz => ({ ...qz, [moduleId]: data }))
    }
    if (q.id) {
      await supabase.from('quiz_questions').update({
        question_text: q.question_text, option_a: q.option_a, option_b: q.option_b,
        option_c: q.option_c, option_d: q.option_d, correct_option: q.correct_option, explanation: q.explanation
      }).eq('id', q.id)
      setQuestions(prev => ({ ...prev, [moduleId]: prev[moduleId]?.map(x => x.id === q.id ? { ...x, ...q } : x) || [] }))
    } else {
      const { data } = await supabase.from('quiz_questions').insert({
        quiz_id: quizId, question_text: q.question_text, option_a: q.option_a, option_b: q.option_b,
        option_c: q.option_c, option_d: q.option_d, correct_option: q.correct_option, explanation: q.explanation
      }).select().single()
      setQuestions(prev => ({ ...prev, [moduleId]: [...(prev[moduleId] || []), data] }))
    }
    setEditing(null)
  }

  async function deleteQuestion(questionId, moduleId) {
    await supabase.from('quiz_questions').delete().eq('id', questionId)
    setQuestions(prev => ({ ...prev, [moduleId]: prev[moduleId]?.filter(q => q.id !== questionId) || [] }))
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: '0 0 24px' }}>Quiz Questions</h1>

      {loading ? <div style={{ color: '#94A3B8' }}>Loading...</div> : courses.map(course => (
        <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px' }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={async () => {
              if (expandedCourse === course.id) { setExpandedCourse(null); return }
              setExpandedCourse(course.id)
              await loadModules(course.id)
            }}>
            <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>{course.title}</div>
            <span style={{ fontSize: '16px' }}>{expandedCourse === course.id ? '▼' : '▶'}</span>
          </div>

          {expandedCourse === course.id && (
            <div style={{ borderTop: '1px solid #F8FAFC', padding: '0 20px 16px' }}>
              {(modules[course.id] || []).length === 0 ? (
                <div style={{ color: '#94A3B8', fontSize: '13px', padding: '12px 0' }}>No modules found</div>
              ) : (modules[course.id] || []).map(mod => (
                <div key={mod.id} style={{ marginTop: '12px', background: '#F8FAFC', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={async () => {
                      if (expandedModule === mod.id) { setExpandedModule(null); return }
                      setExpandedModule(mod.id)
                      await loadQuestions(mod.id)
                    }}>
                    <span style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{mod.title}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{questions[mod.id]?.length || 0} questions</span>
                      <span style={{ fontSize: '14px' }}>{expandedModule === mod.id ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {expandedModule === mod.id && (
                    <div style={{ padding: '0 16px 16px' }}>
                      <button onClick={() => setEditing({ module_id: mod.id, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a', explanation: '' })}
                        style={{ padding: '6px 12px', background: '#4F46E5', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', marginBottom: '10px' }}>
                        + Add Question
                      </button>

                      {(questions[mod.id] || []).map((q, i) => (
                        <div key={q.id} style={{ background: 'white', borderRadius: '10px', padding: '10px 12px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>{i + 1}. {q.question_text}</div>
                            <div style={{ fontSize: '11px', color: '#22C55E', marginTop: '2px' }}>✓ {q['option_' + q.correct_option]}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '10px' }}>
                            <button onClick={() => setEditing({ ...q, module_id: mod.id })} style={{ padding: '4px 8px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#64748B' }}>Edit</button>
                            <button onClick={() => deleteQuestion(q.id, mod.id)} style={{ padding: '4px 8px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#F43F5E' }}>Del</button>
                          </div>
                        </div>
                      ))}

                      {(questions[mod.id] || []).length === 0 && (
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>No questions yet — click Add Question</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editing.id ? 'Edit Question' : 'Add Question'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94A3B8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Question</label>
                <textarea value={editing.question_text} onChange={e => setEditing(q => ({ ...q, question_text: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} /></div>
              {['a','b','c','d'].map(opt => (
                <div key={opt}><label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Option {opt.toUpperCase()}</label>
                  <input value={editing['option_' + opt] || ''} onChange={e => setEditing(q => ({ ...q, ['option_' + opt]: e.target.value }))} style={INPUT} /></div>
              ))}
              <div><label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Correct Answer</label>
                <select value={editing.correct_option} onChange={e => setEditing(q => ({ ...q, correct_option: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                  {['a','b','c','d'].map(o => <option key={o} value={o}>Option {o.toUpperCase()}</option>)}
                </select></div>
              <div><label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Explanation</label>
                <textarea value={editing.explanation || ''} onChange={e => setEditing(q => ({ ...q, explanation: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => saveQuestion(editing, editing.module_id)} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Save Question</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`)

// Fix AdminCourses - add ability to create new courses
fs.writeFileSync('src/admin/pages/AdminCourses.jsx', `import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState({})
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingModule, setEditingModule] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    if (editingCourse.id) {
      await supabase.from('courses').update(editingCourse).eq('id', editingCourse.id)
      setCourses(c => c.map(x => x.id === editingCourse.id ? editingCourse : x))
    } else {
      const { data } = await supabase.from('courses').insert(editingCourse).select().single()
      setCourses(c => [...c, data])
    }
    setSaving(false)
    setEditingCourse(null)
  }

  async function saveModule() {
    setSaving(true)
    if (editingModule.id) {
      await supabase.from('modules').update(editingModule).eq('id', editingModule.id)
      setModules(m => ({ ...m, [editingModule.course_id]: m[editingModule.course_id]?.map(mod => mod.id === editingModule.id ? editingModule : mod) || [] }))
    } else {
      const { data } = await supabase.from('modules').insert(editingModule).select().single()
      setModules(m => ({ ...m, [editingModule.course_id]: [...(m[editingModule.course_id] || []), data] }))
    }
    setSaving(false)
    setEditingModule(null)
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }
  const LABEL = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Courses & Modules</h1>
        <button onClick={() => setEditingCourse({ title: '', description: '', slug: '', estimated_hours: 1, is_published: false, sort_order: courses.length + 1 })}
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
          + Add Course
        </button>
      </div>

      {loading ? <div style={{ color: '#94A3B8' }}>Loading...</div> : courses.map(course => (
        <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ cursor: 'pointer', flex: 1 }} onClick={async () => {
              if (expanded === course.id) { setExpanded(null); return }
              setExpanded(course.id)
              await loadModules(course.id)
            }}>
              <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>{course.title}</div>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>{course.is_published ? '✅ Published' : '⏸ Draft'} · {course.estimated_hours}h</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditingCourse({ ...course })}
                style={{ padding: '6px 12px', background: '#EEF2FF', border: 'none', borderRadius: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                Edit
              </button>
              <span style={{ fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }} onClick={async () => {
                if (expanded === course.id) { setExpanded(null); return }
                setExpanded(course.id)
                await loadModules(course.id)
              }}>{expanded === course.id ? '▼' : '▶'}</span>
            </div>
          </div>

          {expanded === course.id && (
            <div style={{ borderTop: '1px solid #F8FAFC', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Modules ({(modules[course.id] || []).length})</span>
                <button onClick={() => setEditingModule({ course_id: course.id, title: '', description: '', reading_content: '', video_url: '', estimated_minutes: 45, tier_required: 'nurse', sort_order: (modules[course.id]?.length || 0) + 1, is_published: false })}
                  style={{ padding: '6px 12px', background: '#EEF2FF', border: 'none', borderRadius: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                  + Add Module
                </button>
              </div>
              {(modules[course.id] || []).map(mod => (
                <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#0A2540', fontSize: '13px' }}>{mod.title}</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>{mod.tier_required} · {mod.estimated_minutes}min · {mod.is_published ? '✅ Published' : '⏸ Draft'}</div>
                  </div>
                  <button onClick={() => setEditingModule({ ...mod })}
                    style={{ padding: '6px 10px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Course Modal */}
      {editingCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '560px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editingCourse.id ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setEditingCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94A3B8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={LABEL}>Title</label><input value={editingCourse.title} onChange={e => setEditingCourse(x => ({ ...x, title: e.target.value }))} style={INPUT} /></div>
              <div><label style={LABEL}>Description</label><textarea value={editingCourse.description || ''} onChange={e => setEditingCourse(x => ({ ...x, description: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} /></div>
              <div><label style={LABEL}>Slug (URL)</label><input value={editingCourse.slug || ''} onChange={e => setEditingCourse(x => ({ ...x, slug: e.target.value }))} placeholder="e.g. ctg-interpretation" style={INPUT} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={LABEL}>Estimated Hours</label><input type="number" value={editingCourse.estimated_hours || 1} onChange={e => setEditingCourse(x => ({ ...x, estimated_hours: parseFloat(e.target.value) }))} style={INPUT} /></div>
                <div><label style={LABEL}>Sort Order</label><input type="number" value={editingCourse.sort_order || 1} onChange={e => setEditingCourse(x => ({ ...x, sort_order: parseInt(e.target.value) }))} style={INPUT} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingCourse.is_published} onChange={e => setEditingCourse(x => ({ ...x, is_published: e.target.checked }))} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>Published</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditingCourse(null)} style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveCourse} disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Course'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {editingModule && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editingModule.id ? 'Edit Module' : 'Add Module'}</h2>
              <button onClick={() => setEditingModule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94A3B8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={LABEL}>Title</label><input value={editingModule.title} onChange={e => setEditingModule(x => ({ ...x, title: e.target.value }))} style={INPUT} /></div>
              <div><label style={LABEL}>Description</label><textarea value={editingModule.description || ''} onChange={e => setEditingModule(x => ({ ...x, description: e.target.value }))} rows={2} style={{ ...INPUT, resize: 'vertical' }} /></div>
              <div><label style={LABEL}>Reading Content</label><textarea value={editingModule.reading_content || ''} onChange={e => setEditingModule(x => ({ ...x, reading_content: e.target.value }))} rows={8} style={{ ...INPUT, resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} /></div>
              <div><label style={LABEL}>Video URL</label><input value={editingModule.video_url || ''} onChange={e => setEditingModule(x => ({ ...x, video_url: e.target.value }))} placeholder="https://youtube.com/embed/..." style={INPUT} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div><label style={LABEL}>Duration (mins)</label><input type="number" value={editingModule.estimated_minutes} onChange={e => setEditingModule(x => ({ ...x, estimated_minutes: parseInt(e.target.value) }))} style={INPUT} /></div>
                <div><label style={LABEL}>Tier Required</label>
                  <select value={editingModule.tier_required} onChange={e => setEditingModule(x => ({ ...x, tier_required: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                    {['free','student','nurse','passport'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label style={LABEL}>Sort Order</label><input type="number" value={editingModule.sort_order} onChange={e => setEditingModule(x => ({ ...x, sort_order: parseInt(e.target.value) }))} style={INPUT} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingModule.is_published} onChange={e => setEditingModule(x => ({ ...x, is_published: e.target.checked }))} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>Published</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditingModule(null)} style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveModule} disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Module'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`)

console.log('AdminCourses and AdminQuizQuestions updated!')

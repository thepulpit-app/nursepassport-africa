import { useEffect, useState } from 'react'
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
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

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

  async function saveQuestion() {
    if (!editing.question_text || !editing.option_a || !editing.option_b || !editing.option_c || !editing.option_d) {
      setMsg('Please fill in the question and all 4 options')
      return
    }
    setSaving(true)
    setMsg('')
    try {
      const moduleId = editing.module_id
      let quizId = quizzes[moduleId]?.id
      if (!quizId) {
        const { data, error } = await supabase.from('quizzes').insert({ module_id: moduleId, pass_score: 70 }).select().single()
        if (error) throw error
        quizId = data.id
        setQuizzes(qz => ({ ...qz, [moduleId]: data }))
      }
      if (editing.id) {
        const { error } = await supabase.from('quiz_questions').update({
          question_text: editing.question_text,
          option_a: editing.option_a,
          option_b: editing.option_b,
          option_c: editing.option_c,
          option_d: editing.option_d,
          correct_option: editing.correct_option,
          explanation: editing.explanation,
        }).eq('id', editing.id)
        if (error) throw error
        setQuestions(prev => ({ ...prev, [moduleId]: prev[moduleId]?.map(x => x.id === editing.id ? { ...x, ...editing } : x) || [] }))
      } else {
        const { data, error } = await supabase.from('quiz_questions').insert({
          quiz_id: quizId,
          question_text: editing.question_text,
          option_a: editing.option_a,
          option_b: editing.option_b,
          option_c: editing.option_c,
          option_d: editing.option_d,
          correct_option: editing.correct_option,
          explanation: editing.explanation,
        }).select().single()
        if (error) throw error
        setQuestions(prev => ({ ...prev, [moduleId]: [...(prev[moduleId] || []), data] }))
      }
      setEditing(null)
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
  }

  async function deleteQuestion(questionId, moduleId) {
    await supabase.from('quiz_questions').delete().eq('id', questionId)
    setQuestions(prev => ({ ...prev, [moduleId]: prev[moduleId]?.filter(q => q.id !== questionId) || [] }))
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: '0 0 24px' }}>Quiz Questions</h1>

      {loading ? <div style={{ color: '#94A3B8' }}>Loading courses...</div> : courses.map(course => (
        <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px' }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={async () => {
              if (expandedCourse === course.id) { setExpandedCourse(null); return }
              setExpandedCourse(course.id)
              await loadModules(course.id)
            }}>
            <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>{course.title}</div>
            <span style={{ color: '#94A3B8' }}>{expandedCourse === course.id ? '▼' : '▶'}</span>
          </div>

          {expandedCourse === course.id && (
            <div style={{ borderTop: '1px solid #F8FAFC', padding: '8px 20px 16px' }}>
              {(modules[course.id] || []).length === 0 && (
                <div style={{ color: '#94A3B8', fontSize: '13px', padding: '8px 0' }}>No modules in this course</div>
              )}
              {(modules[course.id] || []).map(mod => (
                <div key={mod.id} style={{ marginTop: '10px', background: '#F8FAFC', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={async () => {
                      if (expandedModule === mod.id) { setExpandedModule(null); return }
                      setExpandedModule(mod.id)
                      await loadQuestions(mod.id)
                    }}>
                    <span style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{mod.title}</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{questions[mod.id]?.length ?? '?'} questions</span>
                      <span style={{ color: '#94A3B8' }}>{expandedModule === mod.id ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {expandedModule === mod.id && (
                    <div style={{ padding: '0 16px 16px' }}>
                      <button onClick={() => { setMsg(''); setEditing({ module_id: mod.id, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a', explanation: '' }) }}
                        style={{ padding: '8px 16px', background: '#4F46E5', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginBottom: '12px' }}>
                        + Add Question
                      </button>

                      {(questions[mod.id] || []).length === 0 && (
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>No questions yet</div>
                      )}

                      {(questions[mod.id] || []).map((q, i) => (
                        <div key={q.id} style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', border: '1px solid #F1F5F9' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540', marginBottom: '4px' }}>{i + 1}. {q.question_text}</div>
                            <div style={{ fontSize: '11px', color: '#22C55E' }}>Correct: {q['option_' + q.correct_option]}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                            <button onClick={() => { setMsg(''); setEditing({ ...q, module_id: mod.id }) }}
                              style={{ padding: '5px 10px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Edit</button>
                            <button onClick={() => deleteQuestion(q.id, mod.id)}
                              style={{ padding: '5px 10px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#F43F5E', fontWeight: '600' }}>Del</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Question Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editing.id ? 'Edit Question' : 'New Question'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#94A3B8', lineHeight: 1 }}>x</button>
            </div>
            {msg && <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '10px 14px', color: '#F43F5E', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Question *</label>
                <textarea value={editing.question_text} onChange={e => setEditing(q => ({ ...q, question_text: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} placeholder="Type the question here..." />
              </div>
              {['a', 'b', 'c', 'd'].map(opt => (
                <div key={opt}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Option {opt.toUpperCase()} *</label>
                  <input value={editing['option_' + opt] || ''} onChange={e => setEditing(q => ({ ...q, ['option_' + opt]: e.target.value }))} style={INPUT} placeholder={'Option ' + opt.toUpperCase()} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Correct Answer *</label>
                <select value={editing.correct_option} onChange={e => setEditing(q => ({ ...q, correct_option: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                  {['a', 'b', 'c', 'd'].map(o => <option key={o} value={o}>Option {o.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Explanation</label>
                <textarea value={editing.explanation || ''} onChange={e => setEditing(q => ({ ...q, explanation: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} placeholder="Why is this the correct answer?" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '13px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveQuestion} disabled={saving} style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
}
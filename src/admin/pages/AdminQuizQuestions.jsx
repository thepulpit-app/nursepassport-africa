import { useEffect, useState } from 'react'
import { Plus, Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminQuizQuestions() {
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState({})
  const [quizzes, setQuizzes] = useState({})
  const [questions, setQuestions] = useState({})
  const [expanded, setExpanded] = useState(null)
  const [editing, setEditing] = useState(null)
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

  async function loadQuestions(moduleId) {
    if (questions[moduleId]) return
    const { data: quizData } = await supabase.from('quizzes').select('*, quiz_questions(*)').eq('module_id', moduleId).single()
    if (quizData) {
      setQuizzes(q => ({ ...q, [moduleId]: quizData }))
      setQuestions(q => ({ ...q, [moduleId]: quizData.quiz_questions || [] }))
    } else {
      setQuestions(q => ({ ...q, [moduleId]: [] }))
    }
  }

  async function saveQuestion(q, moduleId) {
    let quizId = quizzes[moduleId]?.id
    if (!quizId) {
      const { data: newQuiz } = await supabase.from('quizzes').insert({ module_id: moduleId, pass_score: 70 }).select().single()
      quizId = newQuiz.id
      setQuizzes(qz => ({ ...qz, [moduleId]: newQuiz }))
    }
    if (q.id) {
      await supabase.from('quiz_questions').update({ question_text: q.question_text, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_option: q.correct_option, explanation: q.explanation }).eq('id', q.id)
      setQuestions(prev => ({ ...prev, [moduleId]: prev[moduleId]?.map(x => x.id === q.id ? q : x) || [] }))
    } else {
      const { data } = await supabase.from('quiz_questions').insert({ quiz_id: quizId, ...q }).select().single()
      setQuestions(prev => ({ ...prev, [moduleId]: [...(prev[moduleId] || []), data] }))
    }
    toast.success('Question saved')
    setEditing(null)
  }

  async function deleteQuestion(questionId, moduleId) {
    await supabase.from('quiz_questions').delete().eq('id', questionId)
    setQuestions(prev => ({ ...prev, [moduleId]: prev[moduleId]?.filter(q => q.id !== questionId) || [] }))
    toast.success('Question deleted')
  }

  const CORRECT_OPTIONS = ['a', 'b', 'c', 'd']

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Quiz Questions</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Add and manage quiz questions for each module</p>
      </div>

      {loading ? <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '16px' }} /> :
        courses.map(course => (
          <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={async () => {
                if (expanded === course.id) { setExpanded(null); return }
                setExpanded(course.id)
                await loadModules(course.id)
              }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>{course.title}</div>
              </div>
              {expanded === course.id ? <ChevronUp size={18} color="#94A3B8" /> : <ChevronDown size={18} color="#94A3B8" />}
            </div>

            {expanded === course.id && (
              <div style={{ borderTop: '1px solid #F1F5F9', padding: '12px 20px 16px' }}>
                {(modules[course.id] || []).map(mod => (
                  <div key={mod.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{mod.title}</div>
                      <button
                        onClick={async () => {
                          await loadQuestions(mod.id)
                          setEditing({ quiz_id: null, module_id: mod.id, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a', explanation: '' })
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#4F46E5' }}>
                        <Plus size={12} /> Add Question
                      </button>
                    </div>

                    {!questions[mod.id] ? (
                      <button onClick={() => loadQuestions(mod.id)}
                        style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
                        Load questions →
                      </button>
                    ) : questions[mod.id].length === 0 ? (
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', padding: '8px 0' }}>No questions yet — click Add Question</div>
                    ) : (
                      questions[mod.id].map((q, i) => (
                        <div key={q.id} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', color: '#0A2540', fontSize: '13px', marginBottom: '4px' }}>{i + 1}. {q.question_text}</div>
                              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Correct: {q.correct_option?.toUpperCase()} · {q[`option_${q.correct_option}`]}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                              <button onClick={() => setEditing({ ...q, module_id: mod.id })}
                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '11px', color: '#64748B' }}>
                                <Edit2 size={11} />
                              </button>
                              <button onClick={() => deleteQuestion(q.id, mod.id)}
                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FECDD3', background: '#FFF1F2', cursor: 'pointer', fontSize: '11px', color: '#F43F5E' }}>
                                <X size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      }

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: 0 }}>{editing.id ? 'Edit Question' : 'Add Question'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Question</label>
                <textarea value={editing.question_text} onChange={e => setEditing(q => ({ ...q, question_text: e.target.value }))} rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', color: '#0A2540' }} />
              </div>
              {['a', 'b', 'c', 'd'].map(opt => (
                <div key={opt}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Option {opt.toUpperCase()}</label>
                  <input value={editing[`option_${opt}`] || ''} onChange={e => setEditing(q => ({ ...q, [`option_${opt}`]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Correct Answer</label>
                <select value={editing.correct_option} onChange={e => setEditing(q => ({ ...q, correct_option: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', background: 'white', color: '#0A2540', boxSizing: 'border-box' }}>
                  {CORRECT_OPTIONS.map(o => <option key={o} value={o}>Option {o.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Explanation</label>
                <textarea value={editing.explanation || ''} onChange={e => setEditing(q => ({ ...q, explanation: e.target.value }))} rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', color: '#0A2540' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditing(null)}
                style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#64748B', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => saveQuestion(editing, editing.module_id)}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Save size={14} /> Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

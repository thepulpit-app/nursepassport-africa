import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const SAMPLE_NUGGETS = [
  { title: 'CTG Clinical Tip', body: 'A sinusoidal CTG pattern is always pathological under NICE (2022). Immediate senior review is mandatory — never wait.' },
  { title: 'NCLEX Tip', body: 'For priority questions: always use ABC — Airway, Breathing, Circulation. Physiological instability beats everything else.' },
  { title: 'Obstetric Emergency', body: 'In shoulder dystocia — NEVER apply fundal pressure. McRoberts manoeuvre and suprapubic pressure are your first steps.' },
  { title: 'NMC OSCE Tip', body: 'SBAR: Situation, Background, Assessment, Recommendation. Always end with a clear recommendation — do not just present information.' },
  { title: 'Medication Safety', body: 'IV Potassium Chloride must never be given as a bolus — always via infusion pump. It is a high-alert medication in all hospitals.' },
  { title: 'Sepsis Recognition', body: 'A NEWS2 score of 7 or above requires urgent medical review. Time to antibiotics within one hour saves lives.' },
  { title: 'BLS Reminder', body: 'Paediatric cardiac arrest is usually respiratory — always give 5 rescue breaths FIRST before starting chest compressions.' },
  { title: 'HAAD Tip', body: 'Under UAE Patient Rights Law, a competent adult has the absolute right to refuse treatment — regardless of family wishes.' },
]

export default function AdminNuggets() {
  const [subs, setSubs] = useState(0)
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')
  const [nugget, setNugget] = useState({ title: '', body: '', url: '/dashboard' })
  const [history, setHistory] = useState([])

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [subRes, histRes] = await Promise.all([
      supabase.from('push_subscriptions').select('id', { count: 'exact', head: true }),
      supabase.from('nugget_history').select('*').order('sent_at', { ascending: false }).limit(10),
    ])
    setSubs(subRes.count || 0)
    setHistory(histRes.data || [])
  }

  async function sendNugget() {
    if (!nugget.title || !nugget.body) { setMsg('Title and message are required'); return }
    setSending(true)
    setMsg('')
    try {
      const { data: subscriptions } = await supabase.from('push_subscriptions').select('subscription')
      if (!subscriptions?.length) { setMsg('No subscribers yet'); setSending(false); return }

      // Send via Supabase Edge Function
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: { title: nugget.title, body: nugget.body, url: nugget.url, subscriptions }
      })
      if (error) throw error

      // Log to history
      await supabase.from('nugget_history').insert({
        title: nugget.title, body: nugget.body, sent_to: subscriptions.length, sent_at: new Date().toISOString()
      })

      setMsg(`Sent to ${subscriptions.length} subscribers`)
      setNugget({ title: '', body: '', url: '/dashboard' })
      loadData()
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSending(false)
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }
  const LABEL = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Daily Clinical Nuggets</h1>
        <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '10px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#4F46E5' }}>{subs}</div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>SUBSCRIBERS</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

        {/* Send nugget */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Send a Nugget</h3>
          {msg && <div style={{ background: msg.includes('Error') ? '#FFF1F2' : '#F0FDF4', border: `1px solid ${msg.includes('Error') ? '#FECDD3' : '#BBF7D0'}`, borderRadius: '8px', padding: '10px 14px', color: msg.includes('Error') ? '#F43F5E' : '#22C55E', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div><label style={LABEL}>Title</label><input value={nugget.title} onChange={e => setNugget(n => ({ ...n, title: e.target.value }))} placeholder="e.g. CTG Clinical Tip" style={INPUT} /></div>
            <div><label style={LABEL}>Message</label><textarea value={nugget.body} onChange={e => setNugget(n => ({ ...n, body: e.target.value }))} rows={4} placeholder="The clinical tip or exam insight..." style={{ ...INPUT, resize: 'vertical' }} /></div>
            <div><label style={LABEL}>Link (optional)</label>
              <select value={nugget.url} onChange={e => setNugget(n => ({ ...n, url: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                <option value="/dashboard">Dashboard</option>
                <option value="/simulate">ClinicalSim</option>
                <option value="/courses">Courses</option>
                <option value="/questions">Question Banks</option>
              </select>
            </div>
            <button onClick={sendNugget} disabled={sending}
              style={{ padding: '13px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', opacity: sending ? 0.7 : 1 }}>
              {sending ? 'Sending...' : `Send to ${subs} subscribers`}
            </button>
          </div>
        </div>

        {/* Sample nuggets */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Quick Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
            {SAMPLE_NUGGETS.map((s, i) => (
              <div key={i} onClick={() => setNugget(n => ({ ...n, title: s.title, body: s.body }))}
                style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', cursor: 'pointer', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A2540', marginBottom: '3px' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Recent Nuggets Sent</h3>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0A2540' }}>{h.title}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(h.sent_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', background: '#EEF2FF', color: '#4F46E5' }}>{h.sent_to} sent</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

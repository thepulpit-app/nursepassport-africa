const fs = require('fs')

const files = {
'src/admin/pages/AdminDashboard.jsx': `import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    const [usersRes, certRes, recentRes] = await Promise.all([
      supabase.from('profiles').select('subscription_tier, created_at'),
      supabase.from('certificates').select('id', { count: 'exact' }),
      supabase.from('profiles').select('full_name, email, subscription_tier, created_at').order('created_at', { ascending: false }).limit(8),
    ])
    const users = usersRes.data || []
    setStats({
      total: users.length,
      paid: users.filter(u => u.subscription_tier !== 'free').length,
      nurse: users.filter(u => u.subscription_tier === 'nurse').length,
      passport: users.filter(u => u.subscription_tier === 'passport').length,
      student: users.filter(u => u.subscription_tier === 'student').length,
      free: users.filter(u => u.subscription_tier === 'free').length,
      certs: certRes.count || 0,
    })
    setRecent(recentRes.data || [])
    setLoading(false)
  }

  const TC = { free:{bg:'#F1F5F9',color:'#64748B'}, student:{bg:'#EEF2FF',color:'#4F46E5'}, nurse:{bg:'#F0FDF4',color:'#22C55E'}, passport:{bg:'#FFFBEB',color:'#F59E0B'} }

  if (loading) return <div style={{color:'#94A3B8'}}>Loading...</div>

  return (
    <div>
      <h1 style={{fontSize:'26px',fontWeight:'800',color:'#0A2540',margin:'0 0 24px'}}>Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'32px'}}>
        {[{label:'Total Users',value:stats.total,color:'#4F46E5'},{label:'Paid Users',value:stats.paid,color:'#22C55E'},{label:'Certificates',value:stats.certs,color:'#F59E0B'},{label:'Passport',value:stats.passport,color:'#F43F5E'}].map(s => (
          <div key={s.label} style={{background:'white',borderRadius:'16px',padding:'20px',border:'1px solid #F1F5F9'}}>
            <div style={{fontSize:'32px',fontWeight:'900',color:s.color}}>{s.value}</div>
            <div style={{fontSize:'13px',color:'#94A3B8',fontWeight:'600',marginTop:'4px'}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div style={{background:'white',borderRadius:'16px',padding:'20px',border:'1px solid #F1F5F9'}}>
          <h2 style={{fontSize:'15px',fontWeight:'800',color:'#0A2540',margin:'0 0 16px'}}>Tier Breakdown</h2>
          {[{label:'Free',value:stats.free},{label:'Student',value:stats.student},{label:'Nurse',value:stats.nurse},{label:'Passport',value:stats.passport}].map(t => (
            <div key={t.label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F8FAFC'}}>
              <span style={{fontSize:'13px',color:'#0A2540',fontWeight:'600'}}>{t.label}</span>
              <span style={{fontSize:'13px',fontWeight:'800',color:TC[t.label.toLowerCase()]?.color||'#64748B'}}>{t.value}</span>
            </div>
          ))}
        </div>
        <div style={{background:'white',borderRadius:'16px',padding:'20px',border:'1px solid #F1F5F9'}}>
          <h2 style={{fontSize:'15px',fontWeight:'800',color:'#0A2540',margin:'0 0 16px'}}>Recent Signups</h2>
          {recent.map((u,i) => {
            const t = TC[u.subscription_tier]||TC.free
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:i<recent.length-1?'1px solid #F8FAFC':'none'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',fontSize:'13px',color:'#4F46E5',flexShrink:0}}>{u.full_name?.[0]?.toUpperCase()||'N'}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'13px',fontWeight:'600',color:'#0A2540',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.full_name||'Unknown'}</div>
                  <div style={{fontSize:'11px',color:'#94A3B8'}}>{new Date(u.created_at).toLocaleDateString('en-NG',{day:'numeric',month:'short'})}</div>
                </div>
                <span style={{fontSize:'10px',fontWeight:'700',padding:'3px 8px',borderRadius:'99px',background:t.bg,color:t.color}}>{u.subscription_tier}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}`,

'src/admin/pages/AdminUsers.jsx': `import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TIERS = ['free','student','nurse','passport']
const TC = {free:{bg:'#F1F5F9',color:'#64748B'},student:{bg:'#EEF2FF',color:'#4F46E5'},nurse:{bg:'#F0FDF4',color:'#22C55E'},passport:{bg:'#FFFBEB',color:'#F59E0B'}}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { supabase.from('profiles').select('*').order('created_at',{ascending:false}).then(({data})=>{setUsers(data||[]);setLoading(false)}) }, [])

  async function updateTier(userId, tier) {
    setUpdating(userId)
    await supabase.from('profiles').update({subscription_tier:tier}).eq('id',userId)
    setUsers(u => u.map(user => user.id===userId ? {...user,subscription_tier:tier} : user))
    setUpdating(null)
  }

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'26px',fontWeight:'800',color:'#0A2540',margin:0}}>Users ({users.length})</h1>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." style={{padding:'10px 14px',borderRadius:'10px',border:'1.5px solid #E2E8F0',fontSize:'13px',outline:'none',width:'240px',color:'#0A2540'}} />
      </div>
      {loading ? <div style={{color:'#94A3B8'}}>Loading...</div> : (
        <div style={{background:'white',borderRadius:'16px',border:'1px solid #F1F5F9',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#F8FAFC'}}>{['Name','Email','Tier','Joined','Flags'].map(h=><th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:'700',color:'#64748B',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((user) => {
                const t = TC[user.subscription_tier]||TC.free
                return (
                  <tr key={user.id} style={{borderTop:'1px solid #F8FAFC'}}>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',fontSize:'12px',color:'#4F46E5',flexShrink:0}}>{user.full_name?.[0]?.toUpperCase()||'N'}</div>
                        <span style={{fontSize:'13px',fontWeight:'600',color:'#0A2540'}}>{user.full_name||'—'}</span>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px',fontSize:'13px',color:'#64748B'}}>{user.email}</td>
                    <td style={{padding:'12px 16px'}}>
                      <select value={user.subscription_tier} disabled={updating===user.id} onChange={e=>updateTier(user.id,e.target.value)} style={{padding:'4px 8px',borderRadius:'6px',border:'1px solid '+t.color,background:t.bg,color:t.color,fontWeight:'700',fontSize:'11px',cursor:'pointer',outline:'none'}}>
                        {TIERS.map(tier=><option key={tier} value={tier}>{tier}</option>)}
                      </select>
                    </td>
                    <td style={{padding:'12px 16px',fontSize:'12px',color:'#94A3B8'}}>{new Date(user.created_at).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'2-digit'})}</td>
                    <td style={{padding:'12px 16px'}}>
                      {user.is_admin && <span style={{fontSize:'10px',fontWeight:'700',padding:'3px 8px',borderRadius:'99px',background:'#FFF7ED',color:'#F59E0B',marginRight:'4px'}}>Admin</span>}
                      {user.is_founding_member && <span style={{fontSize:'10px',fontWeight:'700',padding:'3px 8px',borderRadius:'99px',background:'#FFFBEB',color:'#F59E0B'}}>⭐</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}`,

'src/admin/pages/AdminCertificates.jsx': `import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminCertificates() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { supabase.from('certificates').select('*, profiles(full_name,email), courses(title)').order('issued_at',{ascending:false}).then(({data})=>{setCerts(data||[]);setLoading(false)}) }, [])

  const filtered = certs.filter(c => c.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || c.certificate_number?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'26px',fontWeight:'800',color:'#0A2540',margin:0}}>Certificates ({certs.length})</h1>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{padding:'10px 14px',borderRadius:'10px',border:'1.5px solid #E2E8F0',fontSize:'13px',outline:'none',width:'220px',color:'#0A2540'}} />
      </div>
      {loading ? <div style={{color:'#94A3B8'}}>Loading...</div> : (
        <div style={{background:'white',borderRadius:'16px',border:'1px solid #F1F5F9',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#F8FAFC'}}>{['Certificate ID','Nurse','Course','Issued'].map(h=><th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:'700',color:'#64748B',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((cert) => (
                <tr key={cert.id} style={{borderTop:'1px solid #F8FAFC'}}>
                  <td style={{padding:'12px 16px',fontSize:'12px',fontFamily:'monospace',fontWeight:'700',color:'#4F46E5'}}>{cert.certificate_number}</td>
                  <td style={{padding:'12px 16px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#0A2540'}}>{cert.profiles?.full_name}</div><div style={{fontSize:'11px',color:'#94A3B8'}}>{cert.profiles?.email}</div></td>
                  <td style={{padding:'12px 16px',fontSize:'13px',color:'#64748B'}}>{cert.courses?.title}</td>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#94A3B8'}}>{new Date(cert.issued_at).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}`,
}

Object.entries(files).forEach(([path, content]) => {
  fs.writeFileSync(path, content)
  console.log('Written:', path)
})

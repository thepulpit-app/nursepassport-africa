import { useEffect, useState } from 'react'
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
}
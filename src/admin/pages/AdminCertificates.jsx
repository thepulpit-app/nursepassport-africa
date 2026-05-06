import { useEffect, useState } from 'react'
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
}
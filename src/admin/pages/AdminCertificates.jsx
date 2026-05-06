import { useEffect, useState } from 'react'
import { Award, Search, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminShell from './AdminShell'

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCertificates() }, [])

  async function loadCertificates() {
    const { data } = await supabase
      .from('certificates')
      .select('*, profiles(full_name, email), courses(title)')
      .order('issued_at', { ascending: false })
    setCertificates(data || [])
    setLoading(false)
  }

  const filtered = certificates.filter(c =>
    c.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.certificate_number?.toLowerCase().includes(search.toLowerCase()) ||
    c.courses?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Certificates</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>{certificates.length} certificates issued</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by nurse name, email, or certificate number..."
          style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
      </div>

      {loading ? (
        <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '16px' }} />
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: '#FFFBEB', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Award size={24} color="#F59E0B" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 6px' }}>
            {search ? 'No certificates found' : 'No certificates issued yet'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
            {search ? 'Try a different search term' : 'Certificates are issued automatically when nurses complete all modules and pass assessments.'}
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Nurse', 'Course', 'Certificate ID', 'Issued', 'Status', 'PDF'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert, i) => (
                <tr key={cert.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>
                        {cert.profiles?.full_name?.[0]?.toUpperCase() || 'N'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{cert.profiles?.full_name || 'Unknown'}</div>
                        <div style={{ color: '#94A3B8', fontSize: '11px' }}>{cert.profiles?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#0A2540', fontWeight: '500', maxWidth: '200px' }}>
                    {cert.courses?.title || 'Unknown Course'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: '#4F46E5', background: '#EEF2FF', padding: '4px 8px', borderRadius: '6px' }}>
                      {cert.certificate_number}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8' }}>
                    {new Date(cert.issued_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: cert.is_valid ? '#F0FDF4' : '#FFF1F2', color: cert.is_valid ? '#22C55E' : '#F43F5E' }}>
                      {cert.is_valid ? '✓ Valid' : '✗ Revoked'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {cert.pdf_url ? (
                      <button onClick={() => window.open(cert.pdf_url, '_blank')}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '11px', color: '#64748B' }}>
                        <Download size={11} /> PDF
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#CBD5E1' }}>Not generated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}

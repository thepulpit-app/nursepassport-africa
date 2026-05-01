import { useEffect, useState } from 'react'
import { Award, Download, Share2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'

export default function CertificateList() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCerts() }, [profile])

  async function loadCerts() {
    const { data } = await supabase.from('certificates').select('*, courses(title)').eq('user_id', profile.id).order('issued_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  return (
    <AppShell>
      <style>{`
        .cert-card { border-radius: 20px; overflow: hidden; background: white; border: 1px solid #F1F5F9; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .cert-header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 20px; }
        .cert-body { padding: 16px 20px 20px; }
        .cert-btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-weight: '700'; font-size: 13px; cursor: pointer; border: none; flex: 1; font-weight: 700; }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Certificates</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Your verified AMCC clinical certifications</p>
      </div>

      {loading ? (
        <div style={{ height: '200px', background: '#F1F5F9', borderRadius: '20px' }} />
      ) : certs.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#EEF2FF', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Award size={28} color="#6366F1" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: '0 0 8px' }}>No certificates yet</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, maxWidth: '260px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.5' }}>
            Complete all modules in a course and pass the assessment to earn your AMCC certificate.
          </p>
        </div>
      ) : (
        certs.map((cert) => (
          <div key={cert.id} className="cert-card">
            <div className="cert-header">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#F59E0B', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    🏆 AMCC Certificate
                  </div>
                  <h3 style={{ color: 'white', fontWeight: '800', fontSize: '16px', margin: '0 0 4px', lineHeight: '1.3' }}>
                    {cert.courses?.title || 'Course Certificate'}
                  </h3>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{profile?.full_name}</div>
                </div>
                <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={22} color="white" />
                </div>
              </div>
            </div>
            <div className="cert-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Certificate ID</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{cert.certificate_number}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Issued</div>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>
                    {new Date(cert.issued_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {cert.pdf_url && (
                  <button className="cert-btn" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white' }}
                    onClick={() => window.open(cert.pdf_url, '_blank')}>
                    <Download size={14} /> Download PDF
                  </button>
                )}
                <button className="cert-btn" style={{ background: '#EEF2FF', color: '#6366F1' }}
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificate_number}`); alert('Link copied!') }}>
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </AppShell>
  )
}

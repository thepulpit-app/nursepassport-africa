import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyCertificate() {
  const { certificateNumber } = useParams()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadCert() {
      const { data } = await supabase
        .from('certificates')
        .select('*, profiles(full_name, qualification), courses(title)')
        .eq('certificate_number', certificateNumber)
        .single()

      if (data) setCert(data)
      else setNotFound(true)
      setLoading(false)
    }
    loadCert()
  }, [certificateNumber])

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '8px' }}>
            <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
            <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '16px' }}>NursePassport Africa</span>
          </Link>
          <div style={{ color: '#94A3B8', fontSize: '13px' }}>Certificate Verification Portal</div>
        </div>

        {loading ? (
          <div style={{ background: 'white', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <p style={{ color: '#94A3B8' }}>Verifying certificate...</p>
          </div>
        ) : notFound ? (
          <div style={{ background: 'white', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid #FECDD3' }}>
            <div style={{ width: '64px', height: '64px', background: '#FFF1F2', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <XCircle size={32} color="#F43F5E" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', marginBottom: '8px' }}>Certificate Not Found</h2>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
              The certificate <strong style={{ fontFamily: 'monospace' }}>{certificateNumber}</strong> could not be found in our records.
            </p>
            <p style={{ color: '#94A3B8', fontSize: '13px' }}>
              If you believe this is an error, contact <a href="mailto:hello@nursepassportafrica.com" style={{ color: '#F43F5E' }}>hello@nursepassportafrica.com</a>
            </p>
          </div>
        ) : (
          <div>
            {/* Valid badge */}
            <div style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', borderRadius: '16px', padding: '16px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={28} color="white" />
              <div>
                <div style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>Certificate Verified ✓</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>This is an authentic AMCC certificate</div>
              </div>
            </div>

            {/* Certificate card */}
            <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', padding: '28px' }}>
                <div style={{ color: '#F4A300', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  🏆 AMCC Certificate of Completion
                </div>
                <h2 style={{ color: 'white', fontWeight: '800', fontSize: '22px', marginBottom: '4px' }}>
                  {cert.profiles?.full_name}
                </h2>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
                  {cert.profiles?.qualification || 'Registered Nurse'}
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Course Completed</div>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '16px' }}>{cert.courses?.title || 'AMCC Course'}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Certificate ID</div>
                    <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#4F46E5', fontSize: '14px' }}>{cert.certificate_number}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Issue Date</div>
                    <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>
                      {new Date(cert.issued_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Issuing Body</div>
                    <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>AMCC</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0FDF4', color: '#22C55E', fontWeight: '700', fontSize: '13px', padding: '3px 10px', borderRadius: '99px' }}>
                      <CheckCircle size={12} /> Valid
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#64748B', lineHeight: '1.6' }}>
                  This certificate was issued by Advanced Medical Care Consultancy (AMCC) through NursePassport Africa. 
                  It confirms successful completion of the above course aligned to NICE (2022) and RCOG standards.
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '13px' }}>
              Verified by <strong style={{ color: '#0A2540' }}>NursePassport Africa</strong> · 
              <a href="mailto:hello@nursepassportafrica.com" style={{ color: '#F43F5E', marginLeft: '4px' }}>hello@nursepassportafrica.com</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

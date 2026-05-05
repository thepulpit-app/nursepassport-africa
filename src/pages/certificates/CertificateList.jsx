import { useEffect, useState } from 'react'
import { Award, Download, Share2, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'

export default function CertificateList() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => { loadCerts() }, [profile])

  async function loadCerts() {
    const { data } = await supabase
      .from('certificates')
      .select('*, courses(title)')
      .eq('user_id', profile.id)
      .order('issued_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  async function handleDownload(cert) {
    setDownloading(cert.id)
    try {
      // Fetch signatory settings
      const { data: platformSettings } = await supabase.from('platform_settings').select('*').eq('id', 1).single()
      const sig1Name = platformSettings?.signatory1_name || '${sig1Name}'
      const sig1Title = platformSettings?.signatory1_title || '${sig1Title}'
      const sig1Url = platformSettings?.signatory1_signature_url || ''
      const sig2Name = platformSettings?.signatory2_name || 'NursePassport Africa'
      const sig2Title = platformSettings?.signatory2_title || '${sig2Title}'
      const sig2Url = platformSettings?.signatory2_signature_url || ''
      // Fetch logo as base64 so it works inside blob HTML
      let logoBase64 = ''
      try {
        const logoResp = await fetch('/icons/icon-128.png')
        if (logoResp.ok) {
          const logoBlob = await logoResp.blob()
          logoBase64 = await new Promise((res) => {
            const reader = new FileReader()
            reader.onload = () => res(reader.result)
            reader.readAsDataURL(logoBlob)
          })
        }
      } catch (e) {
        logoBase64 = ''
      }
      // Generate certificate HTML and open in new tab for printing
      const issueDate = new Date(cert.issued_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
      const verifyUrl = `https://www.nursepassportafrica.com/verify/${cert.certificate_number}`
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verifyUrl)}`

      const certHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 297mm; height: 210mm; }
  body { font-family: 'Inter', sans-serif; background: white; }
  .cert {
    width: 297mm; height: 210mm; position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: center;
    padding: 32px 52px 28px;
    background: white;
    gap: 0;
  }
  .border-outer { position: absolute; inset: 10px; border: 3px solid #0A2540; border-radius: 4px; pointer-events: none; }
  .border-inner { position: absolute; inset: 18px; border: 1px solid #00897B; border-radius: 2px; pointer-events: none; }
  .watermark { position: absolute; opacity: 0.035; font-size: 190px; font-weight: 900; color: #0A2540; font-family: 'Playfair Display', serif; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none; z-index: 0; }
  /* TOP */
  .top { display: flex; align-items: center; justify-content: space-between; width: 100%; position: relative; z-index: 1; }
  .top-brand { display: flex; align-items: center; gap: 12px; }
  .logo-box { width: 48px; height: 48px; background: #0A2540; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
  .brand-name { font-size: 20px; font-weight: 800; color: #0A2540; line-height: 1.2; }
  .brand-sub { font-size: 10px; color: #94A3B8; margin-top: 1px; }
  .cert-label-top { font-size: 10px; color: #94A3B8; letter-spacing: 0.3em; text-transform: uppercase; text-align: right; }
  /* MIDDLE */
  .middle { text-align: center; position: relative; z-index: 1; padding: 8px 0; }
  .divider { width: 60px; height: 3px; background: linear-gradient(90deg, #0A2540, #00897B); margin: 0 auto 14px; border-radius: 99px; }
  .certify-text { font-size: 13px; color: #64748B; margin-bottom: 6px; }
  .nurse-name { font-family: 'Playfair Display', serif; font-size: 56px; color: #0A2540; font-style: italic; line-height: 1.1; padding-bottom: 6px; border-bottom: 2px solid #00897B; margin-bottom: 10px; display: inline-block; }
  .completed-text { font-size: 13px; color: #64748B; margin-bottom: 6px; }
  .course-name { font-size: 24px; font-weight: 800; color: #0A2540; margin-bottom: 4px; }
  .standards { font-size: 11px; color: #94A3B8; }
  /* FOOTER */
  .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; position: relative; z-index: 1; }
  .sig { text-align: center; min-width: 160px; }
  .sig-img { height: 44px; object-fit: contain; margin-bottom: 2px; display: block; margin-left: auto; margin-right: auto; }
  .sig-line { width: 160px; height: 1px; background: #0A2540; margin: 0 auto 5px; }
  .sig-name { font-size: 12px; font-weight: 700; color: #0A2540; }
  .sig-title { font-size: 10px; color: #64748B; margin-top: 1px; }
  .cert-meta { text-align: center; }
  .cert-num { font-family: monospace; font-size: 11px; font-weight: 700; color: #4F46E5; margin-bottom: 4px; }
  .badge { background: #0A2540; color: white; padding: 4px 14px; border-radius: 99px; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; display: inline-block; margin-bottom: 4px; }
  .date { font-size: 10px; color: #94A3B8; margin-bottom: 6px; }
  .qr-wrap { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .qr-label { font-size: 8px; color: #94A3B8; letter-spacing: 0.05em; text-transform: uppercase; }
  @media print { html, body { width: 297mm; height: 210mm; margin: 0; } @page { size: A4 landscape; margin: 0; } }
</style>
</head>
<body>
<div class="cert">
  <div class="border-outer"></div>
  <div class="border-inner"></div>
  <div class="watermark">AMCC</div>

  <!-- TOP -->
  <div class="top">
    <div class="top-brand">
      <div class="logo-box">
        ${logoBase64 ? `<img src="${logoBase64}" alt="NursePassport" style="width:48px;height:48px;object-fit:cover;" />` : `<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:13px;font-family:Inter,sans-serif;letter-spacing:-0.5px;">NPA</div>`}
      </div>
      <div>
        <div class="brand-name">NursePassport Africa</div>
        <div class="brand-sub">Powered by AMCC · Advanced Medical Care Consultancy</div>
      </div>
    </div>
    <div class="cert-label-top">Certificate of Completion</div>
  </div>

  <!-- MIDDLE -->
  <div class="middle">
    <div class="divider"></div>
    <div class="certify-text">This is to certify that</div>
    <div class="nurse-name">${profile.full_name}</div>
    <div class="completed-text">has successfully completed</div>
    <div class="course-name">${cert.courses?.title || 'AMCC Course'}</div>
    <div class="standards">Aligned to NICE (2022) & RCOG Standards · With Distinction</div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="sig">
      ${sig1Url ? `<img src="${sig1Url}" class="sig-img" alt="signature" />` : '<div style="height:46px"></div>'}
      <div class="sig-line"></div>
      <div class="sig-name">${sig1Name}</div>
      <div class="sig-title">${sig1Title}</div>
    </div>
    <div class="cert-meta">
      <div class="cert-num">${cert.certificate_number}</div>
      <div class="badge">AMCC CERTIFIED</div>
      <div class="date">${issueDate}</div>
      <div class="qr-wrap">
        <img src="${qrUrl}" width="70" height="70" alt="QR" />
        <div class="qr-label">Scan to verify</div>
      </div>
    </div>
    <div class="sig">
      ${sig2Url ? `<img src="${sig2Url}" class="sig-img" alt="signature" />` : '<div style="height:46px"></div>'}
      <div class="sig-line"></div>
      <div class="sig-name">${sig2Name}</div>
      <div class="sig-title">${sig2Title}</div>
    </div>
  </div>
</div>
<script>window.onload = () => { window.print() }</script>
</body>
</html>`

      const blob = new Blob([certHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')
      if (!win) toast.error('Please allow popups to download certificate')
      else toast.success('Certificate opened — use Ctrl+P to save as PDF')
    } catch (err) {
      toast.error('Download failed. Please try again.')
    }
    setDownloading(null)
  }

  function handleShare(cert) {
    const url = `${window.location.origin}/verify/${cert.certificate_number}`
    navigator.clipboard.writeText(url)
    toast.success('Verification link copied!')
  }

  return (
    <AppShell>
      <style>{`
        .cert-card { border-radius: 20px; overflow: hidden; background: white; border: 1px solid #F1F5F9; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .cert-header { background: linear-gradient(135deg, #0A2540, #1E3A5F); padding: 20px; }
        .cert-body { padding: 16px 20px 20px; } .cert-btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; border: none; flex: 1; transition: opacity 0.2s; }
        .cert-btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; border: none; flex: 1; }
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
                  <div style={{ color: '#F4A300', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
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
                  <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#4F46E5', fontSize: '13px' }}>{cert.certificate_number}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Issued</div>
                  <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>
                    {new Date(cert.issued_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <div style={{ flex: 1 }}>
                  <button onClick={() => handleDownload(cert)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white' }}>
                    <Download size={14} />
                    <span>{downloading === cert.id ? 'Opening...' : 'Download PDF'}</span>
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <button onClick={() => handleShare(cert)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#EEF2FF', color: '#6366F1' }}>
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                </div>
                <div>
                  <button onClick={() => window.open('/verify/' + cert.certificate_number, '_blank')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#F8FAFC', color: '#64748B' }}>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </AppShell>
  )
}
// force redeploy Mon May  4 13:27:14 UTC 2026

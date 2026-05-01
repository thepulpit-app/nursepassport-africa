import { useEffect, useState } from 'react'
import { Award, Download, Share2, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'

export default function CertificateList() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCerts() }, [profile])

  async function loadCerts() {
    const { data } = await supabase.from('certificates')
      .select('*, courses(title, slug)')
      .eq('user_id', profile.id)
      .order('issued_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>My Certificates</h1>
        <p className="text-[#64748B] mt-1">Your verified AMCC clinical certifications</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Award size={48} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0A2540] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>No certificates yet</h2>
          <p className="text-[#64748B] text-sm max-w-xs mx-auto">Complete all modules in a course and pass the assessment to earn your AMCC certificate.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {certs.map((cert) => (
            <div key={cert.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              {/* Certificate header */}
              <div className="bg-gradient-to-br from-[#0A2540] to-[#0D3060] p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[#F4A300] text-xs font-semibold uppercase tracking-wide mb-1">AMCC Certificate</div>
                    <h3 className="text-white font-bold text-lg leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {cert.courses?.title || 'Course Certificate'}
                    </h3>
                    <div className="text-white/60 text-sm mt-1">{profile?.full_name}</div>
                  </div>
                  <div className="w-12 h-12 bg-[#F4A300]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-[#F4A300]" />
                  </div>
                </div>
              </div>

              {/* Certificate details */}
              <div className="p-5">
                <div className="flex items-center justify-between text-sm mb-4">
                  <div>
                    <div className="text-[#64748B] text-xs">Certificate ID</div>
                    <div className="font-mono font-semibold text-[#0A2540] text-sm">{cert.certificate_number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#64748B] text-xs">Issued</div>
                    <div className="font-semibold text-[#0A2540] text-sm">
                      {new Date(cert.issued_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {cert.pdf_url && (
                    <Button variant="primary" size="sm" onClick={() => window.open(cert.pdf_url, '_blank')}>
                      <Download size={14} /> Download PDF
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificate_number}`)
                    alert('Verification link copied!')
                  }}>
                    <Share2 size={14} /> Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}

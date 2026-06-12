import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function ExamLandingTemplate({ data }) {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .landing-btn { border: none; border-radius: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .landing-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .section { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        @media (min-width: 640px) { .hero-btns { flex-direction: row !important; } .grid2 { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F1F5F9' }}>
        <div className="section" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
            <div>
              <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport</span>
              <span style={{ fontWeight: '800', color: '#F43F5E', fontSize: '15px' }}> Africa</span>
            </div>
          </div>
          <button className="landing-btn" onClick={() => navigate('/signup')}
            style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '14px' }}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 50%, #0A2540 100%)', padding: '64px 20px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: `radial-gradient(circle, ${data.accentColor}33 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div className="section" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{data.flag}</div>
          <h1 style={{ color: 'white', fontWeight: '900', fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1.2', marginBottom: '16px' }}>
            {data.h1}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }}>
            {data.subhero}
          </p>
          <div className="hero-btns" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <button className="landing-btn" onClick={() => navigate('/try')}
              style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '16px' }}>
              Try a Free Practice Scenario <ArrowRight size={18} />
            </button>
            <button className="landing-btn" onClick={() => navigate('/signup')}
              style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '16px', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Intro content */}
      <section style={{ padding: '64px 20px', background: 'white' }}>
        <div className="section">
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0A2540', marginBottom: '16px' }}>{data.introTitle}</h2>
          {data.introParagraphs.map((p, i) => (
            <p key={i} style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>{p}</p>
          ))}
        </div>
      </section>

      {/* What's covered */}
      <section style={{ padding: '64px 20px', background: '#F8FAFC' }}>
        <div className="section">
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0A2540', marginBottom: '24px', textAlign: 'center' }}>
            What NursePassport Africa Offers for {data.examShort}
          </h2>
          <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {data.features.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.emoji}</div>
                <h3 style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why prepare with us */}
      <section style={{ padding: '64px 20px', background: 'white' }}>
        <div className="section">
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0A2540', marginBottom: '20px' }}>
            Why Prepare for {data.examShort} with NursePassport Africa?
          </h2>
          {data.whyPoints.map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <CheckCircle size={18} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#0A2540', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '64px 20px', background: '#F8FAFC' }}>
        <div className="section">
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0A2540', marginBottom: '24px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          {data.faqs.map((faq, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', border: '1px solid #F1F5F9', marginBottom: '10px', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                <span style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>{faq.q}</span>
                <ChevronDown size={18} color="#94A3B8" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px' }}>
                  <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '64px 20px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', textAlign: 'center' }}>
        <div className="section">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>{data.flag}</div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '900', color: 'white', marginBottom: '12px' }}>{data.ctaTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>{data.ctaSubtitle}</p>
          <button className="landing-btn" onClick={() => navigate('/signup')}
            style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '16px' }}>
            Create Your Free Account <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #F1F5F9', padding: '24px 20px', background: 'white' }}>
        <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
            <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '14px' }}>NursePassport Africa</span>
          </div>
          <div style={{ color: '#94A3B8', fontSize: '13px' }}>© 2026 AMCC · Advanced Medical Care Consultancy</div>
        </div>
      </footer>
    </div>
  )
}

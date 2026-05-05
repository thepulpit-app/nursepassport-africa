import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckCircle, ArrowRight, Star, Activity, Award, BookOpen, Globe } from 'lucide-react'

const FEATURES = [
  { emoji: '📚', title: 'Structured Courses', desc: 'CTG Interpretation, BLS, Obstetric Emergencies — built to NICE (2022) & RCOG standards.', color: '#EEF2FF', ic: '#6366F1' },
  { emoji: '🩺', title: 'ClinicalSim AI', desc: 'Practice real patient scenarios. Get instant expert clinical feedback powered by AI.', color: '#FFF1F2', ic: '#F43F5E' },
  { emoji: '🎓', title: 'AMCC Certificates', desc: 'Earn verifiable certificates recognised by UK, UAE & international employers.', color: '#FFFBEB', ic: '#F59E0B' },
  { emoji: '✈️', title: 'Placement Portfolio', desc: 'Build a shareable profile for UK, UAE, Canada & USA recruiters. Get placed faster.', color: '#F0FDF4', ic: '#22C55E' },
]

const TESTIMONIALS = [
  { name: 'Adaeze O.', role: 'RN, Lagos → NHS Trust, London', text: 'The CTG course finally made me confident reading traces. I passed my NMC prep on first attempt.', stars: 5 },
  { name: 'Funke A.', role: 'Midwife, Abuja', text: 'ClinicalSim is like having a senior midwife beside you at 2am. The feedback is incredible.', stars: 5 },
  { name: 'Chidi N.', role: 'RN, Port Harcourt → Dubai', text: 'My AMCC certificate was the first thing my UAE recruiter asked about. Worth every naira.', stars: 5 },
]

const PLANS = [
  { name: 'Student', emoji: '🎓', price: '₦1750', sub: '/month', gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)', features: ['All courses & modules', 'Module assessments', 'AMCC certificates', '50% student discount'], student: true },
  { name: 'Grace', emoji: '🌱', price: 'Free', sub: 'Forever free', gradient: 'linear-gradient(135deg, #64748B, #475569)', features: ['2 course modules', '3 sim sessions/month', 'Basic progress tracking'] },
  { name: 'Nurse', emoji: '🩺', price: '₦4,500', sub: '/month', gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)', features: ['All courses & modules', '20 sim sessions/month', 'AMCC certificates', 'Progress analytics'], popular: true },
  { name: 'Passport', emoji: '✈️', price: '₦9,000', sub: '/month', gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)', features: ['Unlimited simulations', 'OSCE prep track', 'Placement portfolio', 'UK · UAE · USA · Canada'] },
]

export default function Landing() {
  const navigate = useNavigate()
  const [founderCount, setFounderCount] = useState(null)

  useEffect(() => {
    supabase.from('profiles').select('id', { count: 'exact' }).then(({ count }) => {
      setFounderCount(count || 0)
    })
  }, [])

  const spotsRemaining = Math.max(0, 100 - (founderCount || 0))
  const isFull = spotsRemaining === 0

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .landing-btn { border: none; border-radius: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .landing-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .section { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        @media (min-width: 640px) { .feature-grid { grid-template-columns: repeat(2, 1fr) !important; } .plan-grid { grid-template-columns: repeat(3, 1fr) !important; } .testi-grid { grid-template-columns: repeat(3, 1fr) !important; } .hero-btns { flex-direction: row !important; } }
        @media (min-width: 1024px) { .hero-inner { flex-direction: row !important; align-items: center !important; } .sim-inner { flex-direction: row !important; align-items: center !important; } }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F1F5F9' }}>
        <div className="section" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
            <div>
              <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport</span>
              <span style={{ fontWeight: '800', color: '#F43F5E', fontSize: '15px' }}> Africa</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="landing-btn" onClick={() => navigate('/signin')}
              style={{ padding: '9px 18px', background: 'transparent', color: '#0A2540', fontSize: '14px', border: '1.5px solid #E2E8F0' }}>
              Sign In
            </button>
            <button className="landing-btn" onClick={() => navigate('/signup')}
              style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '14px' }}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 60%, #0A2540 100%)', padding: '80px 20px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="section" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '99px', padding: '6px 14px', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', background: '#F43F5E', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' }}>Powered by AMCC · Built for African Nurses</span>
          </div>
          <h1 style={{ color: 'white', fontWeight: '900', fontSize: 'clamp(32px, 6vw, 64px)', lineHeight: '1.1', marginBottom: '20px', maxWidth: '700px' }}>
            Train. Simulate.<br />
            <span style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Certify.</span> Get Placed.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '560px' }}>
            The end-to-end career platform for African nurses going to the UK, UAE, USA & Canada. AI-powered clinical simulation. AMCC-certified courses.
          </p>
          <div className="hero-btns" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            <button className="landing-btn" onClick={() => navigate('/signup')}
              style={{ padding: '16px 28px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '16px' }}>
              Start Free — No Card Required <ArrowRight size={18} />
            </button>
            <button className="landing-btn" onClick={() => navigate('/signin')}
              style={{ padding: '16px 28px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              I have an account
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {['Free tier available', 'NICE 2022 guidelines', 'AMCC certified', 'UK · UAE · USA · Canada'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                <CheckCircle size={14} color="#22C55E" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'white', borderBottom: '1px solid #F1F5F9' }}>
        <div className="section" style={{ padding: '40px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
          {[
            { value: '200K+', label: 'Nigerian nurses seeking international roles' },
            { value: '4', label: 'Countries — UK, UAE, USA, Canada' },
            { value: '100%', label: 'Built on NICE (2022) & RCOG standards' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '900', color: '#0A2540' }}>{s.value}</div>
              <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px', background: '#F8FAFC' }}>
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '12px' }}>Everything you need to get placed internationally</h2>
            <p style={{ color: '#94A3B8', fontSize: '16px' }}>Two engines. One platform. One login.</p>
          </div>
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', transition: 'all 0.2s' }}>
                <div style={{ width: '52px', height: '52px', background: f.color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontWeight: '800', color: '#0A2540', fontSize: '18px', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ClinicalSim highlight */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="section">
          <div className="sim-inner" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '99px', padding: '6px 14px', marginBottom: '20px' }}>
                <Activity size={14} color="#F43F5E" />
                <span style={{ color: '#F43F5E', fontSize: '13px', fontWeight: '700' }}>ClinicalSim AI</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '16px', lineHeight: '1.2' }}>
                Practice real scenarios.<br />Get expert feedback instantly.
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px' }}>
                ClinicalSim AI presents real patient scenarios — CTG readings, obstetric emergencies, triage decisions. You respond as the nurse on duty. AI scores your clinical decision against NICE & RCOG guidelines.
              </p>
              {['Scored against NICE (2022) & RCOG guidelines', 'Detailed feedback on every clinical decision', 'Designed by Dr. Ibiwunmi Ajijola — licensed RN in UK, UAE & USA', 'Escalating difficulty as you improve'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <CheckCircle size={16} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#0A2540', fontSize: '14px', fontWeight: '500' }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Sim preview card */}
            <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '24px', padding: '24px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F43F5E' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ marginLeft: '8px', fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>ClinicalSim AI</span>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Patient Scenario</div>
                <p style={{ color: 'white', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  A 38-week primigravida in active labour. CTG shows sinusoidal pattern at 06:30. Terbutaline was given 90 minutes ago. Patient is 7cm dilated. <strong style={{ color: '#F43F5E' }}>What is your immediate action?</strong>
                </p>
              </div>
              <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ color: '#6366F1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Nurse Response</div>
                <p style={{ color: '#0A2540', fontSize: '13px', margin: 0, fontStyle: 'italic' }}>"Immediately escalate to physician — sinusoidal pattern is pathological. Prepare for emergency C-section..."</p>
              </div>
              <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '12px', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ color: '#22C55E', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>AI Feedback</div>
                  <div style={{ background: '#22C55E', color: 'white', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '99px' }}>92/100</div>
                </div>
                <p style={{ color: '#166534', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>✅ Correct urgency classification. ✅ Appropriate escalation. Consider also: confirming IV access and documenting time of recognition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 20px', background: '#F8FAFC' }}>
        <div className="section">
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900', color: '#0A2540', textAlign: 'center', marginBottom: '40px' }}>What nurses are saying</h2>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                  {[...Array(t.stars)].map((_, s) => <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ color: '#0A2540', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>{t.name}</div>
                <div style={{ color: '#94A3B8', fontSize: '12px' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)' }}>
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: 'white', marginBottom: '8px' }}>Simple, honest pricing</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>Start free. Upgrade when you're ready.</p>
          </div>
          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', border: plan.popular ? '2px solid #F43F5E' : '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                {plan.popular && (
                  <div style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>
                    ✨ MOST POPULAR
                  </div>
                )}
                <div style={{ background: plan.gradient, padding: '24px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{plan.emoji}</div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '20px', marginBottom: '4px' }}>{plan.name}</div>
                  <div>
                    <span style={{ color: 'white', fontWeight: '900', fontSize: '32px' }}>{plan.price}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginLeft: '4px' }}>{plan.sub}</span>
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <CheckCircle size={14} color="#22C55E" />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{f}</span>
                    </div>
                  ))}
                  <button className="landing-btn" onClick={() => navigate(plan.student ? '/student-registration' : '/signup')}
                    style={{ width: '100%', marginTop: '16px', padding: '13px', background: plan.gradient, color: 'white', fontSize: '14px', justifyContent: 'center', border: 'none' }}>
                    {plan.student ? 'Register as Student' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: 'white', textAlign: 'center' }}>
        <div className="section">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '12px' }}>
            Your passport to international nursing starts here.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '16px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Join African nurses training smarter, certifying faster, and landing international roles.
          </p>
          <button className="landing-btn" onClick={() => navigate('/signup')}
            style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '16px' }}>
            Create Your Free Account <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #F1F5F9', padding: '24px 20px' }}>
        <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🩺</div>
            <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '14px' }}>NursePassport Africa</span>
          </div>
          <div style={{ color: '#94A3B8', fontSize: '13px' }}>© 2025 AMCC · Advanced Medical Care Consultancy</div>
          <a href="mailto:hello@nursepassportafrica.com" style={{ color: '#F43F5E', fontSize: '13px', fontWeight: '600' }}>hello@nursepassportafrica.com</a>
        </div>
      </footer>
    </div>
  )
}

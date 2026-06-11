import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckCircle, ArrowRight, Star, Activity, Award, BookOpen, Zap, Flame, Trophy, Target } from 'lucide-react'

const EXAMS = [
  { flag: '🇺🇸', name: 'NCLEX-RN', country: 'USA', desc: 'Dedicated question bank + clinical simulations aligned to NCLEX test plans', color: '#4F46E5' },
  { flag: '🇬🇧', name: 'NMC CBT & OSCE', country: 'UK', desc: 'CBT question bank and full OSCE mock stations for UK NMC registration', color: '#0891B2' },
  { flag: '🇦🇪', name: 'HAAD & DHA', country: 'UAE', desc: 'Abu Dhabi and Dubai licensing preparation with UAE-specific clinical scenarios', color: '#059669' },
  { flag: '🇳🇬', name: 'NMBN', country: 'Nigeria', desc: 'Nigerian Nursing and Midwifery Board exam preparation and practice', color: '#DC2626' },
]

const FEATURES = [
  { emoji: '📚', title: 'Evidence-Based Courses', desc: 'CTG Interpretation, Obstetric Emergencies, BLS, NMC OSCE — all built to NICE (2022) and RCOG standards by a clinician with 24 years of experience.', color: '#EEF2FF', ic: '#6366F1' },
  { emoji: '🩺', title: 'ClinicalSim AI', desc: 'Practice real patient scenarios and get instant clinical feedback scored against international guidelines. 32 scenarios across 8 specialties.', color: '#FFF1F2', ic: '#F43F5E' },
  { emoji: '🏆', title: 'AMCC Certificates', desc: 'Complete a course, pass the assessment, and earn a verifiable AMCC-certified certificate with a unique QR code — ready for your CV.', color: '#FFFBEB', ic: '#F59E0B' },
  { emoji: '🔥', title: 'Streaks & Challenges', desc: 'Build daily learning habits with streaks, compete on leaderboards, and tackle a new clinical challenge every Monday to stay sharp.', color: '#FFF7ED', ic: '#EA580C' },
]

const PLANS = [
  { name: 'Grace', emoji: '🕊️', price: 'Free', sub: 'Forever free', gradient: 'linear-gradient(135deg, #64748B, #475569)', features: ['2 course modules', '3 sim sessions/month', 'Basic progress tracking', 'Daily clinical nuggets'] },
  { name: 'Nurse', emoji: '🩺', price: '₦4,500', sub: '/month', gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)', features: ['All courses & modules', '20 sim sessions/month', 'All question banks', 'AMCC certificates', 'Streak & leaderboard'], popular: true },
  { name: 'Passport', emoji: '✈️', price: '₦9,000', sub: '/month', gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)', features: ['Unlimited simulations', 'All 4 exam tracks', 'OSCE preparation', 'Priority support', 'UK · UAE · USA · Canada'] },
]

export default function Landing() {
  const navigate = useNavigate()
  const [founderCount, setFounderCount] = useState(null)

  useEffect(() => {
    supabase.rpc('get_founding_member_count').then(({ data }) => {
      setFounderCount(data || 0)
    })
  }, [])

  const spotsRemaining = Math.max(0, 100 - (founderCount || 0))

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .landing-btn { border: none; border-radius: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .landing-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .section { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (min-width: 640px) { 
          .feature-grid { grid-template-columns: repeat(2, 1fr) !important; } 
          .plan-grid { grid-template-columns: repeat(3, 1fr) !important; } 
          .exam-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-btns { flex-direction: row !important; } 
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 1024px) { 
          .sim-inner { flex-direction: row !important; align-items: center !important; } 
          .retention-inner { flex-direction: row !important; align-items: center !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F1F5F9' }}>
        <div className="section" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🩺</div>
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
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 50%, #0A2540 100%)', padding: '80px 20px 100px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="section" style={{ position: 'relative', textAlign: 'center' }}>
          
          {/* Founding member badge */}
          {founderCount !== null && spotsRemaining > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '99px', padding: '6px 16px', marginBottom: '24px' }}>
              <span style={{ width: '6px', height: '6px', background: '#F59E0B', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#FDE68A', fontSize: '13px', fontWeight: '700' }}>
                ⭐ {spotsRemaining} Founding Member spots left — 30% off for 3 months
              </span>
            </div>
          )}

          <h1 style={{ color: 'white', fontWeight: '900', fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: '1.1', marginBottom: '20px' }}>
            Nigerian nurse.<br />
            <span style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your next destination</span><br />
            starts here.
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: '1.6', marginBottom: '16px', maxWidth: '600px', margin: '0 auto 16px' }}>
            Prepare for NCLEX, NMC CBT, HAAD, DHA and NMC OSCE — with evidence-based courses, AI clinical simulations, dedicated question banks, and AMCC-certified certificates.
          </p>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '36px', fontStyle: 'italic' }}>
            Train here. Work anywhere. 🌍
          </p>

          <div className="hero-btns" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
            <button className="landing-btn" onClick={() => navigate('/signup')}
              style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '16px' }}>
              Start Free — No Card Required <ArrowRight size={18} />
            </button>
            <button className="landing-btn" onClick={() => navigate('/signin')}
              style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '16px', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              I already have an account
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {['Free tier available', 'NICE 2022 aligned', 'AMCC certified', 'UK · UAE · USA · Canada'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                <CheckCircle size={14} color="#22C55E" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'white', borderBottom: '1px solid #F1F5F9' }}>
        <div className="section stats-grid" style={{ padding: '32px 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', textAlign: 'center' }}>
          {[
            { value: '32', label: 'Clinical sim scenarios' },
            { value: '4', label: 'International exam tracks' },
            { value: '200K+', label: 'Nigerian nurses going global' },
            { value: '24yrs', label: 'Clinical expertise behind every course' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540' }}>{s.value}</div>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Exam tracks */}
      <section style={{ padding: '80px 20px', background: '#F8FAFC' }}>
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '99px', padding: '6px 16px', marginBottom: '16px' }}>
              <Target size={14} color="#4F46E5" />
              <span style={{ color: '#4F46E5', fontSize: '13px', fontWeight: '700' }}>4 International Exam Tracks</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '12px' }}>
              Which exam are you preparing for?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              NursePassport Africa has dedicated preparation for every major international nursing licence.
            </p>
          </div>
          <div className="exam-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {EXAMS.map((exam, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '40px', flexShrink: 0 }}>{exam.flag}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ fontWeight: '800', color: '#0A2540', fontSize: '18px' }}>{exam.name}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>{exam.country}</span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6' }}>{exam.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="landing-btn" onClick={() => navigate('/signup')}
              style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white', fontSize: '14px' }}>
              Start preparing today — it's free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '12px' }}>
              Everything you need. One platform.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px' }}>Built by a nurse who has been through the international registration process herself.</p>
          </div>
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9' }}>
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

      {/* ClinicalSim */}
      <section style={{ padding: '80px 20px', background: '#F8FAFC' }}>
        <div className="section">
          <div className="sim-inner" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '99px', padding: '6px 14px', marginBottom: '20px' }}>
                <Activity size={14} color="#F43F5E" />
                <span style={{ color: '#F43F5E', fontSize: '13px', fontWeight: '700' }}>ClinicalSim AI — 32 scenarios</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '16px', lineHeight: '1.2' }}>
                Practice real scenarios.<br />Get expert feedback instantly.
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px' }}>
                ClinicalSim AI presents real patient scenarios — CTG readings, obstetric emergencies, medication safety, HAAD patient rights. You respond as the nurse on duty. AI scores your clinical decision against NICE, RCOG and international guidelines.
              </p>
              {[
                'Scored against NICE (2022) & RCOG guidelines',
                'CTG, Obstetrics, BLS, NMC OSCE, HAAD and NCLEX scenarios',
                'Instant feedback on every clinical decision',
                'Designed by Ibiwunmi Ajijola RN — licensed in UAE, USA & Nigeria',
              ].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <CheckCircle size={16} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#0A2540', fontSize: '14px', fontWeight: '500' }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F43F5E' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ marginLeft: '8px', fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>ClinicalSim AI</span>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Patient Scenario</div>
                <p style={{ color: 'white', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  A 38-week primigravida in active labour. CTG shows sinusoidal pattern. Terbutaline was given 90 minutes ago. Patient is 7cm dilated. <strong style={{ color: '#F43F5E' }}>What is your immediate action?</strong>
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
                <p style={{ color: '#166534', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>✓ Correct urgency classification. ✓ Appropriate escalation. Consider also: confirming IV access and documenting time of recognition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retention features */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)' }}>
        <div className="section">
          <div className="retention-inner" style={{ display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center' }}>
            <div style={{ flex: 1, color: 'white' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '99px', padding: '6px 14px', marginBottom: '20px' }}>
                <Flame size={14} color="#F59E0B" />
                <span style={{ color: '#FDE68A', fontSize: '13px', fontWeight: '700' }}>Built for consistency</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.2' }}>
                Stay consistent.<br />Stay competitive.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
                Passing international exams takes months of consistent preparation. NursePassport Africa keeps you coming back with features designed to build daily habits.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '🔥', title: 'Daily Streaks', desc: 'Build a daily practice habit. Your streak grows every day you open the app.' },
                  { icon: '⚡', title: 'Weekly Challenge', desc: 'A new clinical scenario every Monday. Compete with nurses across Africa.' },
                  { icon: '🏆', title: 'Leaderboard', desc: 'See how you rank by streak and simulation score against other nurses.' },
                  { icon: '📚', title: 'Daily Clinical Nuggets', desc: 'A clinical tip every morning delivered to your phone. Never stop learning.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '3px' }}>{item.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, width: '100%' }}>
              {/* Streak mockup */}
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '48px', lineHeight: 1 }}>🔥</div>
                    <div>
                      <div style={{ color: 'white', fontWeight: '900', fontSize: '36px', lineHeight: 1 }}>14</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>14 day streak — you're on fire!</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ color: 'white', fontWeight: '800', fontSize: '20px' }}>21</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600' }}>BEST</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>🏆 Weekly Leaderboard</div>
                  {[
                    { name: 'Adaeze O.', flag: '🇬🇧', streak: 21, medal: '🥇' },
                    { name: 'You', flag: '🇦🇪', streak: 14, medal: '🥈', isMe: true },
                    { name: 'Funke A.', flag: '🇺🇸', streak: 9, medal: '🥉' },
                  ].map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', marginBottom: '6px', background: n.isMe ? 'rgba(79,70,229,0.3)' : 'transparent', border: n.isMe ? '1px solid rgba(79,70,229,0.4)' : 'none' }}>
                      <span style={{ fontSize: '18px' }}>{n.medal}</span>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '13px', flex: 1 }}>{n.name} {n.flag}</span>
                      <span style={{ color: '#F59E0B', fontWeight: '800', fontSize: '14px' }}>{n.streak} 🔥</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(244,63,94,0.2)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <div>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>This Week's Challenge</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>Late Decelerations — 4 days left</div>
                  </div>
                  <span style={{ color: '#F59E0B', marginLeft: 'auto', fontWeight: '700', fontSize: '12px' }}>Pending ⏳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0A2540', marginBottom: '8px' }}>Simple, honest pricing</h2>
            <p style={{ color: '#94A3B8', fontSize: '16px' }}>Start free. Upgrade when you're ready.</p>
            {spotsRemaining > 0 && (
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '99px', padding: '8px 18px' }}>
                <span style={{ fontSize: '14px' }}>⭐</span>
                <span style={{ color: '#92400E', fontSize: '13px', fontWeight: '700' }}>
                  {spotsRemaining} Founding Member spots remaining — 30% off your first 3 months
                </span>
              </div>
            )}
          </div>
          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: '20px', overflow: 'hidden', border: plan.popular ? '2px solid #4F46E5' : '1px solid #F1F5F9', position: 'relative' }}>
                {plan.popular && (
                  <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>
                    ✦ MOST POPULAR
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
                      <span style={{ color: '#0A2540', fontSize: '13px' }}>{f}</span>
                    </div>
                  ))}
                  <button className="landing-btn" onClick={() => navigate('/signup')}
                    style={{ width: '100%', marginTop: '16px', padding: '13px', background: plan.gradient, color: 'white', fontSize: '14px', justifyContent: 'center', border: 'none' }}>
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', textAlign: 'center' }}>
        <div className="section">
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🌍</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: '900', color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
            Train here.<br />Work anywhere.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Join African nurses preparing smarter for NCLEX, NMC, HAAD and OSCE. Your next destination is waiting.
          </p>
          <button className="landing-btn" onClick={() => navigate('/signup')}
            style={{ padding: '18px 36px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', fontSize: '17px' }}>
            Create Your Free Account <ArrowRight size={18} />
          </button>
          <div style={{ marginTop: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            No credit card required · Free tier available forever
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #F1F5F9', padding: '24px 20px', background: 'white' }}>
        <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🩺</div>
            <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '14px' }}>NursePassport Africa</span>
          </div>
          <div style={{ color: '#94A3B8', fontSize: '13px' }}>© 2026 AMCC · Advanced Medical Care Consultancy</div>
          <a href="mailto:hello@nursepassportafrica.com" style={{ color: '#F43F5E', fontSize: '13px', fontWeight: '600' }}>hello@nursepassportafrica.com</a>
        </div>
      </footer>
    </div>
  )
}

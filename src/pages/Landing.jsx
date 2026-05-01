import { useNavigate } from 'react-router-dom'
import { Stethoscope, CheckCircle, Globe, Award, Activity, ArrowRight, Star } from 'lucide-react'
import Button from '../components/ui/Button'

const FEATURES = [
  { icon: '📚', title: 'Structured Courses', desc: 'CTG Interpretation, BLS, Obstetric Emergencies — all built to NICE & RCOG standards.' },
  { icon: '🤖', title: 'ClinicalSim AI', desc: 'Practice real patient scenarios. Get instant clinical feedback powered by AI.' },
  { icon: '🎓', title: 'AMCC Certificates', desc: 'Earn verifiable certificates recognised by international employers and agencies.' },
  { icon: '✈️', title: 'Placement Portfolio', desc: 'Build a shareable profile for UK, UAE, and Canada recruiters. Get placed faster.' },
]

const STATS = [
  { value: '200K+', label: 'Nurses in Nigeria seeking international roles' },
  { value: '400+', label: 'Nursing schools needing a modern platform' },
  { value: '3', label: 'Countries. UK · UAE · Canada' },
]

const TESTIMONIALS = [
  { name: 'Adaeze O.', role: 'RN, Lagos', text: 'The CTG course finally made me confident reading traces. I passed my NMC prep on first attempt.' },
  { name: 'Funke A.', role: 'Midwife, Abuja', text: 'ClinicalSim is like having a senior midwife beside you at 2am. The feedback is gold.' },
  { name: 'Chidi N.', role: 'RN, Port Harcourt', text: 'My certificate from NursePassport was the first thing my UK recruiter asked about.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-[Plus_Jakarta_Sans]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#00897B] rounded-lg flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#0A2540] text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
              NursePassport <span className="text-[#00897B]">Africa</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/signin')}>Sign In</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Get Started Free</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-[#0A2540] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #00897B 0%, transparent 60%), radial-gradient(circle at 80% 20%, #F4A300 0%, transparent 50%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-[#F4A300] rounded-full animate-pulse" />
              Powered by AMCC · Built for African Nurses
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Train. Simulate.<br />
              <span className="text-[#00897B]">Certify.</span> Get Placed.
            </h1>
            <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl leading-relaxed">
              The end-to-end career acceleration platform for African nurses going to the UK, UAE, and Canada.
              AI-powered clinical simulation. AMCC-certified courses. International placement support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" onClick={() => navigate('/signup')}>
                Start Free — No Card Required
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-[#0A2540]"
                onClick={() => navigate('/signin')}
              >
                I have an account
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {['Free tier available', 'NICE 2022 guidelines', 'AMCC certified'].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-white/60 text-sm">
                  <CheckCircle size={14} className="text-[#00897B]" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-extrabold text-[#0A2540] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                <div className="text-[#64748B] text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Everything you need to get placed internationally
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Two engines. One platform. One login.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#00897B]/30 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{f.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ClinicalSim highlight */}
      <section className="bg-[#F7F9FC] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00897B]/10 text-[#00897B] text-sm px-3 py-1.5 rounded-full mb-4 font-medium">
                <Activity size={14} />
                ClinicalSim AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Practice real scenarios.<br />Get expert feedback instantly.
              </h2>
              <p className="text-[#64748B] text-lg mb-6 leading-relaxed">
                ClinicalSim AI presents real patient scenarios — CTG readings, obstetric emergencies, triage decisions.
                You respond as the nurse on duty. AI scores your clinical decision, tells you exactly what you got right,
                what you missed, and what the correct pathway is.
              </p>
              <div className="space-y-3">
                {['Scored against NICE (2022) & RCOG guidelines', 'Detailed feedback on every decision', 'Scenarios by your wife — real clinical expertise', 'Escalating difficulty as you improve'].map(t => (
                  <div key={t} className="flex items-center gap-2.5 text-[#0A2540]">
                    <CheckCircle size={18} className="text-[#00897B] flex-shrink-0" />
                    <span className="text-sm font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Sim preview card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400 font-mono">ClinicalSim AI</span>
              </div>
              <div className="bg-[#F7F9FC] rounded-xl p-4 mb-4">
                <div className="text-xs text-[#64748B] font-semibold uppercase tracking-wide mb-2">Patient Scenario</div>
                <p className="text-sm text-[#0A2540] leading-relaxed">
                  A 38-week primigravida in active labour. CTG shows sinusoidal pattern at 06:30. Terbutaline was given 90 minutes ago. Patient is 7cm dilated.
                  <strong className="text-[#C62828]"> What is your immediate action?</strong>
                </p>
              </div>
              <div className="bg-[#0A2540]/5 rounded-xl p-4 mb-4">
                <div className="text-xs text-[#64748B] font-semibold uppercase tracking-wide mb-2">Nurse Response</div>
                <p className="text-sm text-[#0A2540]">"Immediately escalate to physician — sinusoidal pattern is pathological. Prepare for emergency C-section..."</p>
              </div>
              <div className="bg-[#00897B]/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-[#00897B] font-semibold uppercase tracking-wide">AI Feedback</div>
                  <div className="bg-[#00897B] text-white text-sm font-bold px-3 py-1 rounded-lg">92/100</div>
                </div>
                <p className="text-sm text-[#0A2540] leading-relaxed">
                  ✅ Correct urgency classification. ✅ Appropriate escalation. Consider also: confirming IV access and documenting time of recognition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-[#0A2540] text-center mb-12" style={{ fontFamily: 'Outfit, sans-serif' }}>
          What nurses are saying
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => <Star key={s} size={14} className="text-[#F4A300] fill-[#F4A300]" />)}
              </div>
              <p className="text-[#0A2540] text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div>
                <div className="font-semibold text-[#0A2540] text-sm">{t.name}</div>
                <div className="text-[#64748B] text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#0A2540] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Simple, honest pricing
          </h2>
          <p className="text-white/60 text-center mb-14">Start free. Upgrade when you're ready.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Grace', price: 'Free', sub: 'Forever free', features: ['2 course modules', '3 sim sessions/month', 'Basic progress tracking'], cta: 'Start Free', variant: 'outline', ctaClass: 'border-white/30 text-white hover:bg-white hover:text-[#0A2540]' },
              { name: 'Nurse', price: '₦4,500', sub: '/month or ₦40,000/year', features: ['All courses', '20 sim sessions/month', 'AMCC certificates', 'Progress analytics'], cta: 'Get Nurse Plan', variant: 'primary', popular: true },
              { name: 'Passport', price: '₦9,000', sub: '/month or ₦80,000/year', features: ['Everything in Nurse', 'Unlimited simulations', 'OSCE prep track', 'Placement portfolio', 'UAE HAAD prep'], cta: 'Get Passport Plan', variant: 'gold' },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 relative ${plan.popular ? 'bg-[#00897B] ring-2 ring-[#F4A300]' : 'bg-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F4A300] text-[#0A2540] text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{plan.name}</div>
                <div className="text-3xl font-extrabold text-white mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{plan.price}</div>
                <div className="text-white/60 text-xs mb-6">{plan.sub}</div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle size={14} className="text-[#F4A300] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant}
                  fullWidth
                  className={plan.ctaClass}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <Globe size={40} className="text-[#00897B] mx-auto mb-4" />
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Your passport to international nursing starts here.
        </h2>
        <p className="text-[#64748B] text-lg mb-8">
          Join African nurses training smarter, certifying faster, and landing international roles.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
          Create Your Free Account
          <ArrowRight size={20} />
        </Button>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00897B] rounded-md flex items-center justify-center">
              <Stethoscope size={12} className="text-white" />
            </div>
            <span className="text-[#0A2540] font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>NursePassport Africa</span>
          </div>
          <div className="text-[#64748B] text-sm">© 2025 AMCC · Advanced Medical Care Consultancy · <a href="mailto:hello@nursepassportafrica.com" className="hover:text-[#00897B]">hello@nursepassportafrica.com</a></div>
        </div>
      </footer>
    </div>
  )
}

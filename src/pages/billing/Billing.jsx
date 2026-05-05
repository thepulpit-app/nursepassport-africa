import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { initializePaystackPayment } from '../../lib/paystack'
import AppShell from '../../components/layout/AppShell'

const PLAN_DETAILS = [
  {
    key: 'student', name: 'Student', emoji: '🎓',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    monthlyPrice: 1750, annualPrice: null,
    monthlyPlan: 'student_monthly',
    student: true,
    features: ['All courses & modules', 'Module assessments', 'AMCC certificates', '50% student discount'],
    locked: ['ClinicalSim AI', 'Question Banks', 'OSCE prep'],
  },
  {
    key: 'free', name: 'Grace', emoji: '🌱',
    gradient: 'linear-gradient(135deg, #64748B, #475569)',
    monthlyPrice: 0, annualPrice: 0,
    features: ['2 course modules', '3 sim sessions/month', 'Basic progress tracking', 'Community access'],
    locked: ['Full course access', 'AMCC certificates', 'ClinicalSim AI', 'OSCE prep'],
  },
  {
    key: 'nurse', name: 'Nurse', emoji: '🩺',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    monthlyPlan: 'nurse_monthly', annualPlan: 'nurse_annual',
    monthlyPrice: 4500, annualPrice: 40000,
    popular: true,
    features: ['All courses & modules', '20 sim sessions/month', 'AMCC certificates', 'Progress analytics', 'CTG Masterclass', 'Question Banks'],
    locked: ['OSCE prep track', 'Placement portfolio', 'Unlimited simulations'],
  },
  {
    key: 'passport', name: 'Passport', emoji: '✈️',
    gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)',
    monthlyPlan: 'passport_monthly', annualPlan: 'passport_annual',
    monthlyPrice: 9000, annualPrice: 80000,
    features: ['Everything in Nurse', 'Unlimited simulations', 'OSCE prep track', 'Mock exams', 'Performance analytics', 'Placement portfolio', 'UK · UAE · USA · Canada'],
    locked: [],
  },
]

export default function Billing() {
  const { user, profile, tier } = useAuth()
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(null)

  function handleUpgrade(plan) {
    const pageKey = billing === 'annual' && plan.annualPlan ? plan.annualPlan : plan.monthlyPlan
    if (!pageKey) return
    setLoading(plan.key)
    initializePaystackPayment({
      email: user.email,
      userId: user.id,
      pageKey,
      planName: plan.name,
      onSuccess: () => {
        setLoading(null)
        window.location.reload()
      },
      onClose: () => setLoading(null),
    })
  }

  const savings = {
    nurse: Math.round(((4500 * 12 - 40000) / (4500 * 12)) * 100),
    passport: Math.round(((9000 * 12 - 80000) / (9000 * 12)) * 100)
  }

  return (
    <AppShell>
      <style>{`
        .plan-card { border-radius: 20px; overflow: hidden; background: white; border: 1px solid #F1F5F9; margin-bottom: 16px; }
        .plan-header { padding: 20px; }
        .plan-body { padding: 16px 20px 20px; }
        .feature-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #0A2540; padding: 4px 0; }
        .upgrade-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-weight: 700; font-size: 15px; cursor: pointer; }
        .toggle-btn { padding: 8px 20px; border-radius: 99px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Plans & Billing</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
          Current plan: <strong style={{ color: '#0A2540', textTransform: 'capitalize' }}>{tier}</strong>
          {profile?.is_founding_member && <span style={{ color: '#F59E0B', marginLeft: '6px' }}>⭐ Founding Member</span>}
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#F8FAFC', borderRadius: '99px', padding: '4px', marginBottom: '24px', width: 'fit-content', margin: '0 auto 24px' }}>
        <button className="toggle-btn" onClick={() => setBilling('monthly')}
          style={{ background: billing === 'monthly' ? '#0A2540' : 'transparent', color: billing === 'monthly' ? 'white' : '#64748B' }}>
          Monthly
        </button>
        <button className="toggle-btn" onClick={() => setBilling('annual')}
          style={{ background: billing === 'annual' ? '#0A2540' : 'transparent', color: billing === 'annual' ? 'white' : '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Annual
          <span style={{ background: '#F43F5E', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '99px' }}>
            Save up to {savings.passport}%
          </span>
        </button>
      </div>

      {PLAN_DETAILS.map((plan) => {
        const isCurrent = tier === plan.key
        const isUpgrade = ['free', 'student', 'nurse', 'passport'].indexOf(plan.key) > ['free', 'student', 'nurse', 'passport'].indexOf(tier)
        const price = billing === 'annual' && plan.annualPrice ? plan.annualPrice : plan.monthlyPrice

        return (
          <div key={plan.key} className="plan-card" style={{ border: plan.popular ? '2px solid #7C3AED' : '1px solid #F1F5F9' }}>
            {plan.popular && (
              <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>
                ✨ MOST POPULAR
              </div>
            )}
            <div className="plan-header" style={{ background: plan.gradient }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{plan.emoji}</div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '20px', marginBottom: '2px' }}>{plan.name}</div>
                  {price > 0 ? (
                    <div>
                      <span style={{ color: 'white', fontWeight: '800', fontSize: '28px' }}>₦{price.toLocaleString()}</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginLeft: '4px' }}>
                        {billing === 'annual' && plan.annualPrice ? '/year' : '/month'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ color: 'white', fontWeight: '800', fontSize: '28px' }}>Free</div>
                  )}
                </div>
                {isCurrent && (
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '99px', padding: '6px 14px', color: 'white', fontSize: '12px', fontWeight: '700' }}>
                    Current ✓
                  </div>
                )}
                {billing === 'annual' && plan.annualPrice && savings[plan.key] && (
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '99px', padding: '6px 14px', color: 'white', fontSize: '11px', fontWeight: '700' }}>
                    Save {savings[plan.key]}%
                  </div>
                )}
              </div>
            </div>
            <div className="plan-body">
              <div style={{ marginBottom: '16px' }}>
                {plan.features.map((f, i) => (
                  <div key={i} className="feature-item">
                    <CheckCircle size={14} color="#22C55E" style={{ flexShrink: 0 }} /> {f}
                  </div>
                ))}
                {plan.locked.map((f, i) => (
                  <div key={i} className="feature-item" style={{ opacity: 0.4 }}>
                    <Lock size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
                    <span style={{ textDecoration: 'line-through', color: '#94A3B8' }}>{f}</span>
                  </div>
                ))}
              </div>
              {isCurrent ? (
                <div style={{ width: '100%', padding: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#94A3B8', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                  Your Current Plan
                </div>
              ) : plan.student ? (
                <button className="upgrade-btn" style={{ background: plan.gradient, color: 'white' }}
                  onClick={() => navigate('/student-registration')}>
                  Register as Student
                </button>
              ) : plan.key === 'free' ? (
                <div style={{ width: '100%', padding: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#94A3B8', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                  Free Plan
                </div>
              ) : isUpgrade ? (
                <button className="upgrade-btn" style={{ background: plan.gradient, color: 'white' }}
                  disabled={loading === plan.key}
                  onClick={() => handleUpgrade(plan)}>
                  {loading === plan.key ? 'Processing...' : 'Upgrade to ' + plan.name}
                </button>
              ) : (
                <div style={{ width: '100%', padding: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#94A3B8', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                  Downgrade
                </div>
              )}
            </div>
          </div>
        )
      })}

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 4px' }}>🔒 Payments secured by Paystack · Cancel anytime</p>
        <p style={{ color: '#94A3B8', fontSize: '12px', margin: 0 }}>
          Questions? <a href="mailto:hello@nursepassportafrica.com" style={{ color: '#6366F1', fontWeight: '600' }}>hello@nursepassportafrica.com</a>
        </p>
      </div>
    </AppShell>
  )
}

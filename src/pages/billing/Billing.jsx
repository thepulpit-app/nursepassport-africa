import { useState } from 'react'
import { CheckCircle, Zap, Star, Crown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { PLANS, initializePaystackPayment } from '../../lib/paystack'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const PLAN_DETAILS = [
  {
    key: 'free', name: 'Grace', icon: '🌱', color: 'border-gray-200',
    monthlyPrice: 0, annualPrice: 0,
    features: ['2 course modules', '3 sim sessions/month', 'Basic progress tracking', 'Community access'],
    locked: ['Full course access', 'AMCC certificates', 'Unlimited modules', 'OSCE prep'],
  },
  {
    key: 'nurse', name: 'Nurse', icon: '🩺', color: 'border-[#00897B]', popular: true,
    monthlyPlan: 'nurse_monthly', annualPlan: 'nurse_annual',
    monthlyPrice: 4500, annualPrice: 40000,
    features: ['Everything in Free', 'All courses & modules', '20 sim sessions/month', 'AMCC certificates', 'Progress analytics', 'CTG Masterclass access', 'BLS & Obstetric Emergencies'],
    locked: ['OSCE prep track', 'Placement portfolio', 'UAE HAAD prep'],
  },
  {
    key: 'passport', name: 'Passport', icon: '✈️', color: 'border-[#F4A300]',
    monthlyPlan: 'passport_monthly', annualPlan: 'passport_annual',
    monthlyPrice: 9000, annualPrice: 80000,
    features: ['Everything in Nurse', 'Unlimited sim sessions', 'OSCE prep track', 'Placement portfolio', 'UAE HAAD prep track', 'UK NMC prep track', 'USA NCLEX-RN prep track', 'Canada prep — coming soon', 'Priority support'],
    locked: [],
  },
]

export default function Billing() {
  const { user, profile, tier } = useAuth()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(null)

  function handleUpgrade(plan) {
    const planKey = billing === 'monthly' ? plan.monthlyPlan : plan.annualPlan
    const planDetails = PLANS[planKey]
    if (!planDetails) return

    setLoading(plan.key)
    initializePaystackPayment({
      email: user.email,
      planCode: planDetails.code,
      userId: user.id,
      onSuccess: (response) => {
        toast.success(`Successfully subscribed to ${plan.name} plan!`)
        setLoading(null)
        window.location.reload()
      },
      onClose: () => {
        setLoading(null)
        toast.error('Payment cancelled')
      }
    })
  }

  const annualSavings = { nurse: Math.round(((4500 * 12 - 40000) / (4500 * 12)) * 100), passport: Math.round(((9000 * 12 - 80000) / (9000 * 12)) * 100) }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>Plans & Billing</h1>
        <p className="text-[#64748B] mt-1">
          Current plan: <span className="font-semibold text-[#0A2540] capitalize">{tier}</span>
          {profile?.is_founding_member && <span className="ml-2 text-[#F4A300] font-semibold">⭐ Founding Member</span>}
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button onClick={() => setBilling('monthly')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-[#0A2540] text-white' : 'text-[#64748B] hover:text-[#0A2540]'}`}>
          Monthly
        </button>
        <button onClick={() => setBilling('annual')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-[#0A2540] text-white' : 'text-[#64748B] hover:text-[#0A2540]'}`}>
          Annual
          <span className="bg-[#F4A300] text-[#0A2540] text-xs px-2 py-0.5 rounded-full font-bold">Save up to {annualSavings.passport}%</span>
        </button>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {PLAN_DETAILS.map((plan) => {
          const isCurrent = tier === plan.key
          const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice
          const isUpgrade = ['free', 'nurse', 'passport'].indexOf(plan.key) > ['free', 'nurse', 'passport'].indexOf(tier)

          return (
            <div key={plan.key}
              className={`bg-white rounded-2xl border-2 ${plan.color} overflow-hidden relative transition-all ${plan.popular ? 'shadow-lg scale-[1.02]' : ''}`}>
              {plan.popular && (
                <div className="bg-[#00897B] text-white text-xs font-bold text-center py-1.5 tracking-wide">
                  ✨ MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <div className="text-3xl mb-2">{plan.icon}</div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{plan.name}</h3>

                {price === 0 ? (
                  <div className="text-3xl font-extrabold text-[#0A2540] mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>Free</div>
                ) : (
                  <div>
                    <div className="text-3xl font-extrabold text-[#0A2540]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      ₦{price.toLocaleString()}
                    </div>
                    <div className="text-[#64748B] text-xs">
                      {billing === 'annual' ? '/year' : '/month'}
                      {billing === 'annual' && plan.key !== 'free' && (
                        <span className="ml-2 text-[#00897B] font-semibold">Save {annualSavings[plan.key]}%</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="my-5 border-t border-gray-100" />

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={15} className="text-[#00897B] flex-shrink-0 mt-0.5" />
                      <span className="text-[#0A2540]">{f}</span>
                    </li>
                  ))}
                  {plan.locked.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm opacity-40">
                      <CheckCircle size={15} className="text-gray-300 flex-shrink-0 mt-0.5" />
                      <span className="text-[#64748B] line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="w-full py-3 rounded-xl bg-gray-100 text-[#64748B] text-sm font-semibold text-center">
                    Current Plan ✓
                  </div>
                ) : isUpgrade ? (
                  <Button
                    variant={plan.key === 'passport' ? 'gold' : 'primary'}
                    fullWidth
                    loading={loading === plan.key}
                    onClick={() => handleUpgrade(plan)}
                  >
                    Upgrade to {plan.name}
                  </Button>
                ) : (
                  <div className="w-full py-3 rounded-xl bg-gray-50 text-[#64748B] text-sm font-semibold text-center">
                    Downgrade
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Security note */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
        <p className="text-[#64748B] text-sm">
          🔒 Payments secured by <strong>Paystack</strong> · Cancel anytime · Instant access on upgrade
        </p>
        <p className="text-xs text-[#64748B] mt-2">
          Questions? Email <a href="mailto:hello@nursepassportafrica.com" className="text-[#00897B] hover:underline">hello@nursepassportafrica.com</a>
        </p>
      </div>
    </AppShell>
  )
}

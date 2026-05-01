import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from './Button'

const TIER_ORDER = { free: 0, nurse: 1, passport: 2 }

const TIER_LABELS = {
  nurse:    { name: 'Nurse', price: '₦4,500/month', color: 'bg-[#0A2540]' },
  passport: { name: 'Passport', price: '₦9,000/month', color: 'bg-[#F4A300]' },
}

export default function PaywallGate({ requiredTier, children }) {
  const { tier } = useAuth()
  const navigate = useNavigate()

  if (TIER_ORDER[tier] >= TIER_ORDER[requiredTier]) return children

  const info = TIER_LABELS[requiredTier]

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm opacity-40 overflow-hidden max-h-48">
        {children}
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-4 border border-gray-100">
          <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Lock className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#0A2540] mb-2">
            {info.name} Plan Required
          </h3>
          <p className="text-[#64748B] text-sm mb-6">
            Upgrade to access this content and unlock your full learning path.
          </p>
          <div className="text-2xl font-bold text-[#0A2540] mb-1">{info.price}</div>
          <p className="text-xs text-[#64748B] mb-6">or save with annual billing</p>
          <Button
            variant={requiredTier === 'passport' ? 'gold' : 'primary'}
            fullWidth
            onClick={() => navigate('/billing')}
          >
            Upgrade to {info.name}
          </Button>
          <p className="text-xs text-[#64748B] mt-3">Cancel anytime · Instant access</p>
        </div>
      </div>
    </div>
  )
}

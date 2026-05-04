import { useEffect, useState } from 'react'
import { Copy, Gift, Users, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'

export default function Referral() {
  const { profile, tier } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const referralCode = profile?.referral_code || ''
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`
  const credits = profile?.referral_credits || 0
  const maxDiscount = tier === 'nurse' ? 4500 * 0.5 : tier === 'passport' ? 9000 * 0.5 : 0
  const discountApplied = Math.min(credits, maxDiscount)

  useEffect(() => { loadTransactions() }, [profile])

  async function loadTransactions() {
    const { data } = await supabase.from('referral_transactions').select('*, profiles!referred_id(full_name)').eq('referrer_id', profile.id).order('created_at', { ascending: false })
    setTransactions(data || [])
    setLoading(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 3000)
  }

  const REWARDS = [
    { tier: 'Student', credit: 300, color: '#22C55E', bg: '#F0FDF4' },
    { tier: 'Nurse', credit: 500, color: '#4F46E5', bg: '#EEF2FF' },
    { tier: 'Passport', credit: 1000, color: '#F59E0B', bg: '#FFFBEB' },
  ]

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Refer & Earn</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Earn credits for every nurse you bring to NursePassport</p>
      </div>

      {/* Credits */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Available Credits</div>
            <div style={{ fontSize: '40px', fontWeight: '900', color: '#F4A300', lineHeight: 1 }}>₦{credits.toLocaleString()}</div>
            {discountApplied > 0 && <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', marginTop: '4px' }}>₦{discountApplied.toLocaleString()} off your next bill</div>}
          </div>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gift size={22} color="#F4A300" />
          </div>
        </div>
        {tier !== 'free' && maxDiscount > 0 && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
              <div style={{ background: '#F4A300', height: '100%', width: `${Math.min(100, (discountApplied / maxDiscount) * 100)}%`, borderRadius: '99px' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>Max 50% discount applied</div>
          </div>
        )}
      </div>

      {/* Referral link */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Your Referral Link</h2>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 14px' }}>Share this. When they upgrade, you earn credits automatically.</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#64748B', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {referralLink}
          </div>
          <button onClick={copyLink}
            style={{ background: copied ? '#22C55E' : 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => window.open(`https://wa.me/?text=Join me on NursePassport Africa — the platform for African nurses going international. Use my link: ${referralLink}`, '_blank')}
            style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            WhatsApp
          </button>
          <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=African nurses — NursePassport Africa is your international career platform. Join with my link: ${referralLink}`, '_blank')}
            style={{ flex: 1, background: '#1DA1F2', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Share on X
          </button>
        </div>
      </div>

      {/* Rewards */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 14px' }}>What You Earn</h2>
        {REWARDS.map(r => (
          <div key={r.tier} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: r.bg, borderRadius: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: r.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>{r.tier[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>Refer a {r.tier} subscriber</div>
              <div style={{ color: '#94A3B8', fontSize: '12px' }}>They upgrade to {r.tier} plan</div>
            </div>
            <div style={{ fontWeight: '800', color: r.color, fontSize: '16px' }}>₦{r.credit}</div>
          </div>
        ))}
        <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', marginTop: '8px', fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
          💡 Credits reduce your bill by up to 50%. Credits expire after 6 months. Free signups earn no credit — only paid upgrades count.
        </div>
      </div>

      {/* History */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Referral History</h2>
          <span style={{ fontSize: '13px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> {transactions.length}</span>
        </div>
        {loading ? <div style={{ height: '60px', background: '#F1F5F9', borderRadius: '10px' }} /> :
          transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>No referrals yet</div>
              <div style={{ fontSize: '12px' }}>Share your link to start earning</div>
            </div>
          ) : transactions.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < transactions.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                {t.profiles?.full_name?.[0]?.toUpperCase() || 'N'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#0A2540', fontSize: '13px' }}>{t.profiles?.full_name || 'Nurse'}</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>Upgraded to {t.tier_purchased} · {new Date(t.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
              </div>
              <div style={{ fontWeight: '700', color: '#22C55E', fontSize: '14px' }}>+₦{t.credit_amount}</div>
            </div>
          ))
        }
      </div>
    </AppShell>
  )
}

export const PLANS = {
  nurse_monthly:   { code: 'NURSE_MONTHLY',   amount: 4500,  label: 'Nurse — Monthly',  interval: 'monthly' },
  nurse_annual:    { code: 'NURSE_ANNUAL',     amount: 40000, label: 'Nurse — Annual',   interval: 'annually' },
  passport_monthly:{ code: 'PASSPORT_MONTHLY', amount: 9000,  label: 'Passport — Monthly', interval: 'monthly' },
  passport_annual: { code: 'PASSPORT_ANNUAL',  amount: 80000, label: 'Passport — Annual', interval: 'annually' },
}

export const TIER_LIMITS = {
  free:     { sim_sessions: 3,  label: 'Free' },
  nurse:    { sim_sessions: 20, label: 'Nurse' },
  passport: { sim_sessions: Infinity, label: 'Passport' },
}

export function initializePaystackPayment({ email, planCode, userId, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    console.error('Paystack script not loaded')
    return
  }
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    plan: planCode,
    metadata: {
      custom_fields: [{
        display_name: 'User ID',
        variable_name: 'user_id',
        value: userId
      }]
    },
    callback: (response) => onSuccess(response),
    onClose
  })
  handler.openIframe()
}

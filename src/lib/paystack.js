export const PAYMENT_PAGES = {
  nurse_monthly:   { code: '2072090', url: 'https://paystack.shop/pay/nurse-monthly',   label: 'Nurse Monthly',   amount: 4500 },
  nurse_annual:    { code: '2072151', url: 'https://paystack.shop/pay/nurse-annual',    label: 'Nurse Annual',    amount: 40000 },
  passport_monthly:{ code: '2072152', url: 'https://paystack.shop/pay/passport-monthly',label: 'Passport Monthly',amount: 9000 },
  passport_annual: { code: '2072154', url: 'https://paystack.shop/pay/passport-annual', label: 'Passport Annual', amount: 80000 },
  student_monthly: { code: '2072156', url: 'https://paystack.shop/pay/student-monthly', label: 'Student Monthly', amount: 1750 },
}

export const TIER_LIMITS = {
  free:     { sim_sessions: 3,        courses: true, question_banks: true },
  student:  { sim_sessions: 0,        courses: true, question_banks: false },
  nurse:    { sim_sessions: 20,       courses: true, question_banks: true },
  passport: { sim_sessions: Infinity, courses: true, question_banks: true },
}

export function getPaymentUrl(pageKey, email, userId) {
  const page = PAYMENT_PAGES[pageKey]
  if (!page) return null
  // Pass metadata via URL params so webhook can identify the user
  const params = new URLSearchParams({
    email,
    metadata: JSON.stringify({ userId, plan: pageKey }),
  })
  return `${page.url}?${params.toString()}`
}

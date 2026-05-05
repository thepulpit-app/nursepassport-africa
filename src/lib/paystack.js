export const PAYMENT_PAGES = {
  nurse_monthly:    { amount: 450000,  label: 'Nurse Monthly',   plan: 'nurse' },
  nurse_annual:     { amount: 4000000, label: 'Nurse Annual',    plan: 'nurse' },
  passport_monthly: { amount: 900000,  label: 'Passport Monthly',plan: 'passport' },
  passport_annual:  { amount: 8000000, label: 'Passport Annual', plan: 'passport' },
  student_monthly:  { amount: 175000,  label: 'Student Monthly', plan: 'student' },
}

export const TIER_LIMITS = {
  free:     { sim_sessions: 3,        courses: true, question_banks: true },
  student:  { sim_sessions: 0,        courses: true, question_banks: false },
  nurse:    { sim_sessions: 20,       courses: true, question_banks: true },
  passport: { sim_sessions: Infinity, courses: true, question_banks: true },
}

export function initializePaystackPayment({ email, userId, pageKey, planName, onSuccess, onClose }) {
  const page = PAYMENT_PAGES[pageKey]
  if (!page) return

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  if (!window.PaystackPop) {
    // Load Paystack script dynamically
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => launchPaystack({ email, userId, pageKey, planName, page, publicKey, onSuccess, onClose })
    document.head.appendChild(script)
  } else {
    launchPaystack({ email, userId, pageKey, planName, page, publicKey, onSuccess, onClose })
  }
}

function launchPaystack({ email, userId, pageKey, planName, page, publicKey, onSuccess, onClose }) {
  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: page.amount,
    currency: 'NGN',
    metadata: {
      userId,
      plan: pageKey,
      product: 'nursepassport',
      custom_fields: [
        { display_name: 'User ID', variable_name: 'userId', value: userId },
        { display_name: 'Plan', variable_name: 'plan', value: pageKey },
        { display_name: 'Product', variable_name: 'product', value: 'nursepassport' },
      ]
    },
    onClose,
    callback: (response) => onSuccess(response),
  })
  handler.openIframe()
}

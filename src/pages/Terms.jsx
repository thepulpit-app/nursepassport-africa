import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 1, 2025'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>🩺</div>
          <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport Africa</span>
        </Link>
        <Link to="/" style={{ color: '#F43F5E', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>← Back to Home</Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', border: '1px solid #F1F5F9' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0A2540', marginBottom: '8px' }}>Terms of Service</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '40px' }}>Last updated: {LAST_UPDATED}</p>

          {[
            {
              title: '1. Acceptance of Terms',
              content: `By creating an account on NursePassport Africa, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and AMCC (Advanced Medical Care Consultancy), operated by Sandstorm Media and Studios Limited.

If you do not agree to these terms, please do not use the platform.`
            },
            {
              title: '2. Description of Service',
              content: `NursePassport Africa is an online educational platform providing:

• Structured nursing courses aligned to NICE (2022) and RCOG guidelines
• AI-powered clinical simulation (ClinicalSim AI) for practice purposes
• AMCC educational completion certificates
• Career guidance and placement support resources

The platform is designed for qualified nurses, student nurses, and midwives in Africa preparing for international practice.`
            },
            {
              title: '3. Educational Purpose — Important Disclaimer',
              content: `NursePassport Africa is an educational platform only.

• Content is for learning purposes and does not constitute medical advice
• ClinicalSim AI scenarios are simulations — they do not replace real clinical training, supervised practice, or regulatory certification
• AMCC certificates are educational completion certificates, not professional licences
• You remain responsible for meeting all regulatory requirements of your target country (NMC, HAAD, DHA, NMBN, CGFNS, etc.)
• We do not guarantee employment, licensing, or immigration outcomes`
            },
            {
              title: '4. Account Registration',
              content: `To use the full platform you must create an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain the security of your account password
• Notify us immediately of any unauthorised access to your account
• Be responsible for all activity that occurs under your account
• Not share your account with others or allow others to access your account

You must be at least 18 years old to create an account.`
            },
            {
              title: '5. Subscription Plans and Payments',
              content: `NursePassport Africa offers three subscription tiers: Grace (Free), Nurse, and Passport.

Payments are processed by Paystack and are subject to Paystack's terms. By subscribing you authorise us to charge your payment method on a recurring basis.

Subscriptions auto-renew unless cancelled before the renewal date. You may cancel at any time from your Billing page. Cancellations take effect at the end of the current billing period — no partial refunds are issued for unused time.

We reserve the right to change pricing with 30 days notice to existing subscribers.`
            },
            {
              title: '6. Acceptable Use',
              content: `You agree not to:

• Use the platform for any unlawful purpose
• Share your account credentials with others
• Reproduce, distribute, or resell course content without written permission
• Attempt to reverse engineer or extract the AI simulation scoring system
• Submit false clinical information in simulation sessions for fraudulent purposes
• Misrepresent AMCC certificates as regulatory licences
• Use the platform to harass, harm, or deceive others`
            },
            {
              title: '7. Intellectual Property',
              content: `All course content, ClinicalSim scenarios, clinical rubrics, and platform design are the intellectual property of AMCC and Sandstorm Media and Studios Limited. You are granted a personal, non-transferable licence to access content for your own learning only.

AMCC certificates issued to you are your personal credentials. The AMCC branding and certification marks remain our intellectual property.`
            },
            {
              title: '8. ClinicalSim AI',
              content: `ClinicalSim AI uses the Anthropic Claude API to evaluate clinical responses. By using ClinicalSim you acknowledge:

• AI feedback is educational and may not reflect all clinically correct approaches
• Scores and feedback do not constitute a clinical competency assessment for regulatory purposes
• We are not responsible for clinical decisions made based on simulation feedback
• The AI may occasionally produce inaccurate clinical information — always verify against current guidelines`
            },
            {
              title: '9. Limitation of Liability',
              content: `To the maximum extent permitted by applicable law, AMCC and Sandstorm Media and Studios Limited shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of earnings, employment, or professional standing.

Our total liability to you for any claim shall not exceed the amount you paid us in the 3 months preceding the claim.`
            },
            {
              title: '10. Termination',
              content: `We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activity, or use the platform in a manner harmful to other users or to AMCC's reputation.

You may delete your account at any time by contacting hello@nursepassportafrica.com. Upon deletion, your personal data will be removed in accordance with our Privacy Policy.`
            },
            {
              title: '11. Changes to Terms',
              content: `We may update these Terms of Service from time to time. We will notify you of material changes via email. Continued use of the platform after notification constitutes acceptance of the updated terms.`
            },
            {
              title: '12. Governing Law',
              content: `These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the jurisdiction of Nigerian courts.`
            },
            {
              title: '13. Contact',
              content: `For questions about these terms:\n\nEmail: hello@nursepassportafrica.com\nCompany: AMCC / Sandstorm Media and Studios Limited\nPlatform: nursepassportafrica.com`
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', marginBottom: '12px' }}>{section.title}</h2>
              <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{section.content}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '13px' }}>
        © 2025 AMCC · NursePassport Africa ·{' '}
        <Link to="/privacy" style={{ color: '#F43F5E', textDecoration: 'none', fontWeight: '600' }}>Privacy Policy</Link>
      </footer>
    </div>
  )
}

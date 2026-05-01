import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 1, 2025'

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #F43F5E, #EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>🩺</div>
          <span style={{ fontWeight: '800', color: '#0A2540', fontSize: '15px' }}>NursePassport Africa</span>
        </Link>
        <Link to="/" style={{ color: '#F43F5E', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>← Back to Home</Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', border: '1px solid #F1F5F9' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0A2540', marginBottom: '8px' }}>Privacy Policy</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '40px' }}>Last updated: {LAST_UPDATED}</p>

          {[
            {
              title: '1. Who We Are',
              content: `NursePassport Africa is a product of AMCC (Advanced Medical Care Consultancy), operated by Sandstorm Media and Studios Limited. We are an AI-powered nursing education and clinical simulation platform serving African nurses preparing for international practice in the UK, UAE, USA, Canada, and Nigeria.

Contact: hello@nursepassportafrica.com`
            },
            {
              title: '2. Information We Collect',
              content: `We collect the following information when you create an account and use our platform:

• Personal information: Full name, email address, phone number
• Professional information: Nursing qualification, career goal, country
• Learning data: Course progress, quiz scores, simulation session responses and scores
• Payment information: Processed securely by Paystack — we do not store card details
• Usage data: Pages visited, features used, session duration
• Authentication data: When you sign in with Google, we receive your name and email address from Google`
            },
            {
              title: '3. How We Use Your Information',
              content: `We use your information to:

• Create and manage your NursePassport Africa account
• Personalise your learning path based on your qualification and career goal
• Deliver course content, quizzes, and ClinicalSim AI simulation sessions
• Issue AMCC certificates upon course completion
• Process subscription payments via Paystack
• Send transactional emails (receipts, certificates, account notifications)
• Improve the platform based on usage patterns
• Communicate important updates about the service`
            },
            {
              title: '4. AI-Powered Clinical Simulation',
              content: `Our ClinicalSim AI feature uses the Anthropic Claude API to evaluate your clinical responses to patient scenarios. Your responses are sent to Anthropic's API for processing and evaluation. We do not use your clinical responses to train AI models. Anthropic's privacy policy governs how they handle API data.

ClinicalSim is an educational tool only. It is not a medical device and is not intended to replace clinical training, professional judgment, or regulatory certification requirements.`
            },
            {
              title: '5. Data Sharing',
              content: `We do not sell your personal data. We share data only with:

• Supabase — our database and authentication provider (data stored securely)
• Paystack — payment processing (PCI DSS compliant)
• Anthropic — AI evaluation of simulation responses (API only)
• Vercel — platform hosting and deployment
• Google — if you choose to sign in with Google (name and email only)

All third-party providers are bound by their own privacy policies and data protection agreements.`
            },
            {
              title: '6. Data Storage and Security',
              content: `Your data is stored securely on Supabase infrastructure with Row Level Security (RLS) enabled — meaning your data is only accessible to you. We use HTTPS encryption for all data transmission. Passwords are hashed and never stored in plain text. We implement reasonable technical and organisational measures to protect your personal data.`
            },
            {
              title: '7. Your Rights',
              content: `You have the right to:

• Access the personal data we hold about you
• Correct inaccurate personal data
• Request deletion of your account and associated data
• Export your learning data and certificates
• Withdraw consent for marketing communications at any time

To exercise any of these rights, contact us at hello@nursepassportafrica.com`
            },
            {
              title: '8. Certificates and Credentials',
              content: `AMCC certificates issued through NursePassport Africa are educational completion certificates. They are not regulatory licences. Nurses are responsible for meeting the registration and licensing requirements of their target country (NMC, HAAD, DHA, NMBN, etc.). We do not guarantee employment or licensing outcomes.`
            },
            {
              title: '9. Children',
              content: `NursePassport Africa is intended for qualified or student nurses aged 18 and above. We do not knowingly collect data from anyone under 18. If you believe a minor has created an account, contact us immediately.`
            },
            {
              title: '10. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy.`
            },
            {
              title: '11. Contact Us',
              content: `For privacy-related queries, data requests, or concerns:\n\nEmail: hello@nursepassportafrica.com\nCompany: AMCC / Sandstorm Media and Studios Limited\nPlatform: nursepassportafrica.com`
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
        <Link to="/terms" style={{ color: '#F43F5E', textDecoration: 'none', fontWeight: '600' }}>Terms of Service</Link>
      </footer>
    </div>
  )
}

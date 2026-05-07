import AppShell from '../components/layout/AppShell'

export default function About() {
  return (
    <AppShell>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 0 60px' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 100%)', borderRadius: '24px', padding: '48px 40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '30%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', background: 'rgba(244,163,0,0.15)', border: '1px solid rgba(244,163,0,0.3)', borderRadius: '99px', padding: '6px 16px', fontSize: '12px', fontWeight: '700', color: '#F4A300', marginBottom: '16px', letterSpacing: '0.05em' }}>
              ADVANCED MEDICAL CARE CONSULTANCY
            </div>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '900', margin: '0 0 16px', lineHeight: 1.2 }}>
              Clinical Excellence,<br />Built for African Nurses
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: 1.7, maxWidth: '560px', margin: 0 }}>
              AMCC is a Nigerian-registered healthcare training and consultancy company dedicated to raising the standard of clinical competence for nurses and midwives across Africa and beyond.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '🎯', title: 'Our Mission', text: 'To improve clinical competence, patient safety and healthcare quality through evidence-based training that is accessible to every nurse, wherever they are.' },
            { icon: '🌍', title: 'Our Reach', text: 'Designed for Nigerian nurses, built for the Gulf, recognised internationally. Our curriculum aligns to NICE, NMC, HAAD, and NMBN standards.' },
            { icon: '📜', title: 'Registered in Nigeria', text: 'AMCC is a duly incorporated company under the Companies and Allied Matters Act (CAMA) 2020, certified by the Corporate Affairs Commission.' },
          ].map(item => (
            <div key={item.title} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Clinical Director */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #F8FAFC, #EEF2FF)', padding: '8px 28px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Meet Our Clinical Director</span>
          </div>
          <div style={{ padding: '24px 20px' }}>
            {/* Photo */}
            <div>
              <div style={{ width: '160px', height: '180px', borderRadius: '16px', overflow: 'hidden', border: '3px solid #EEF2FF', boxShadow: '0 8px 32px rgba(79,70,229,0.12)', float: 'left', marginRight: '16px', marginBottom: '12px' }}>
                <img src="/ibiwunmi.jpg" alt="Dr. Ibiwunmi Ajijola" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => {
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #0A2540, #1E3A5F)'
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:64px;">👩‍⚕️</div>'
                  }} />
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0A2540' }}>Ibiwunmi Ajijola</div>
                <div style={{ fontSize: '12px', color: '#4F46E5', fontWeight: '600', marginTop: '2px' }}>RN · US RN</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Clinical Director, AMCC</div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0A2540', margin: '0 0 4px' }}>
                Ibiwunmi Oluwayemisi Ajijola
              </h2>
              <div style={{ fontSize: '13px', color: '#4F46E5', fontWeight: '700', marginBottom: '20px' }}>
                RN · US RN · BSc Nursing (Edinburgh Napier) · MSc Healthcare Management (in view)
              </div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75, margin: '0 0 16px' }}>
                With over 24 years of clinical experience spanning Nigeria, the United Arab Emirates and the United Kingdom, Ibiwunmi brings a rare combination of frontline bedside expertise and international clinical standards to every course she designs and delivers.
              </p>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75, margin: '0 0 20px' }}>
                Her career began at Lagos State General Hospital in Orile-Agege, where she spent eight formative years across Emergency, Paediatrics, Medical, Surgical, and Gynaecological & Obstetrics units. She then moved to the Gulf, working as a Registered Midwife at Saudi German Hospital Dubai — one of the leading private hospitals in the Middle East — specialising in Labour and Delivery, antenatal care, and CTG monitoring and interpretation. Since 2018, she has served as a Staff Nurse in the Medical, Surgical, Maternity Assessment and High Dependency (Gynae & Obstetrics) units at Tawam Hospital Al Ain — a 503-bed JCI Accredited facility in the UAE.
              </p>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75, margin: '0 0 20px' }}>
                Academically, she holds a Bachelor of Science in Nursing from Edinburgh Napier University, Scotland, and is currently pursuing a Master of Science in Healthcare Management at Swiss Business School. She is a licensed Registered Nurse in both Nigeria and the United States (Texas State Board of Nursing, License No. 1077775), and holds an internationally recognised VisaScreen credential.
              </p>

              {/* Credentials */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {['BSc Nursing — Edinburgh Napier University', 'US RN — Texas BON 1077775', 'K2 Perinatal Training', 'PROMPT Certified', 'BLS & Neonatal Resuscitation', 'VisaScreen 2022', 'Member, Nigerian Nurses Association'].map(c => (
                  <span key={c} style={{ fontSize: '11px', fontWeight: '600', padding: '5px 10px', borderRadius: '99px', background: '#F0FDF4', color: '#22C55E', border: '1px solid #BBF7D0' }}>{c}</span>
                ))}
              </div>

              <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '14px 16px', border: '1px solid #FDE68A' }}>
                <p style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "Every nurse deserves access to world-class clinical training — not just those in well-funded hospital systems. NursePassport Africa exists to close that gap."
                </p>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400E', marginTop: '8px' }}>— Ibiwunmi Ajijola, Clinical Director</div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Timeline */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: '0 0 24px' }}>Clinical Career</h3>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #4F46E5, #E2E8F0)' }} />
            {[
              {
                period: '2018 — Present',
                role: 'Staff Nurse — Medical, Surgical, Maternity & High Dependency (Gynae & Obstetrics)',
                org: 'Tawam Hospital, Al Ain, United Arab Emirates',
                note: '503-bed JCI Accredited Hospital · 7 years',
                color: '#4F46E5',
              },
              {
                period: '2016 — 2018',
                role: 'Registered Midwife — Labour & Delivery',
                org: 'Saudi German Hospital, Dubai, UAE',
                note: 'Leading private hospital in the Middle East · CTG monitoring & interpretation',
                color: '#22C55E',
              },
              {
                period: '2007 — 2015',
                role: 'Staff Nurse — Emergency, Paediatrics, Medical, Surgical & Gynaecological Units',
                org: 'Lagos State General Hospital, Orile-Agege, Lagos, Nigeria',
                note: '8 years · Foundation of clinical practice',
                color: '#F59E0B',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: i < 2 ? '28px' : 0, paddingLeft: '40px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '8px', top: '4px', width: '18px', height: '18px', borderRadius: '50%', background: item.color, border: '3px solid white', boxShadow: '0 0 0 2px ' + item.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: item.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{item.period}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A2540', marginBottom: '2px' }}>{item.role}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '2px' }}>{item.org}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What AMCC trains */}
        <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '24px', padding: '32px 28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: '0 0 8px' }}>What AMCC Trains</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 24px' }}>All programmes are evidence-based and aligned to international standards.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { icon: '🫀', title: 'CTG Interpretation', desc: 'NICE (2022) & RCOG-aligned. From fundamentals to complex trace analysis.' },
              { icon: '🚨', title: 'Obstetric Emergencies', desc: 'PPH, eclampsia, shoulder dystocia, cord prolapse — PROMPT certified curriculum.' },
              { icon: '💉', title: 'Basic Life Support (BLS)', desc: 'AHA and ERC-aligned. Adult CPR, AED, choking management and paediatric BLS.' },
              { icon: '🎓', title: 'NMC OSCE Preparation', desc: 'Full mock OSCE experience for nurses preparing for UK registration.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}

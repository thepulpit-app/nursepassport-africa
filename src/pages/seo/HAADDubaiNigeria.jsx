import ExamLandingTemplate from './ExamLandingTemplate'

const data = {
  flag: '🇦🇪',
  accentColor: '#059669',
  examShort: 'HAAD & DHA',
  h1: 'HAAD and DHA Exam Preparation for Nigerian Nurses',
  subhero: 'Prepare for the UAE Health Authority licensing exams — HAAD (Abu Dhabi) and DHA (Dubai) — with clinical simulations built around UAE healthcare standards.',
  introTitle: 'HAAD and DHA Exam Preparation in Nigeria',
  introParagraphs: [
    'The Health Authority Abu Dhabi (HAAD) examination and the Dubai Health Authority (DHA) examination are licensing requirements for nurses seeking to practise in the United Arab Emirates. These exams assess clinical knowledge, patient safety, and adherence to UAE healthcare regulations and standards.',
    'For Nigerian nurses, the UAE represents one of the most accessible international destinations — with strong demand for qualified nurses, relatively achievable licensing requirements compared to NCLEX or NMC, and a large existing community of Nigerian healthcare workers.',
    'However, the HAAD and DHA exams test knowledge of UAE-specific healthcare regulations, scope of practice boundaries, and clinical protocols that differ in important ways from Nigerian practice — particularly around consent, documentation standards, restraint use, and triage protocols.',
    'NursePassport Africa includes ClinicalSim scenarios specifically designed around UAE healthcare regulations — covering topics like HAAD triage standards, medication reconciliation, pressure injury prevention protocols, and patient consent frameworks under UAE law. This gives Nigerian nurses preparing for HAAD or DHA a realistic preview of the clinical reasoning these exams expect.',
  ],
  features: [
    { emoji: '🏥', title: 'UAE-Specific Scenarios', desc: 'ClinicalSim scenarios covering HAAD triage standards, UAE consent law, restraint policies and documentation requirements.' },
    { emoji: '🩺', title: 'ClinicalSim AI', desc: 'Practice real clinical decisions and receive instant AI-scored feedback aligned to international and UAE-specific standards.' },
    { emoji: '📚', title: 'Evidence-Based Courses', desc: 'Core clinical courses built to NICE and RCOG standards, applicable across UK, UAE and global practice.' },
    { emoji: '🔥', title: 'Daily Clinical Nuggets', desc: 'A clinical tip delivered every morning to keep your preparation consistent in the months before your exam.' },
  ],
  whyPoints: [
    'Built by Ibiwunmi Ajijola RN, who is licensed and has practised as a nurse in the UAE — bringing direct, first-hand understanding of UAE healthcare standards.',
    'ClinicalSim scenarios specifically covering HAAD regulations including triage, consent for minors, restraint use, and medication reconciliation.',
    'Affordable pricing in Naira, designed for Nigerian nurses planning their move to the UAE.',
    '62+ clinical scenarios across multiple categories, with HAAD/DHA-specific content continuously expanding.',
    'A free tier to explore the platform risk-free before subscribing.',
    'Community feed where you can connect with other nurses preparing for or already working in the UAE.',
  ],
  faqs: [
    { q: 'What is the difference between HAAD and DHA?', a: 'HAAD (now part of the Department of Health Abu Dhabi) licenses healthcare professionals to practise in Abu Dhabi, while DHA licenses professionals to practise in Dubai. Both exams assess similar core competencies but are administered by different authorities and may have slightly different requirements.' },
    { q: 'How does NursePassport Africa help with HAAD-specific content?', a: 'Our ClinicalSim library includes scenarios specifically built around UAE healthcare regulations — such as triage standards, consent law for minors, restraint policies, and pressure injury reporting requirements under HAAD.' },
    { q: 'Do I need to be in the UAE to use this platform?', a: 'No. NursePassport Africa is fully accessible from Nigeria. You can prepare for your HAAD or DHA exam before travelling.' },
    { q: 'Can I try a scenario before signing up?', a: 'Yes, visit nursepassportafrica.com/try to attempt a free ClinicalSim scenario without an account.' },
    { q: 'What other exam tracks does NursePassport Africa support?', a: 'In addition to HAAD and DHA, NursePassport Africa supports preparation for NCLEX-RN (USA), NMC CBT and OSCE (UK), and NMBN (Nigeria).' },
  ],
  ctaTitle: 'Prepare for your UAE nursing career today',
  ctaSubtitle: 'Build the clinical knowledge UAE employers and licensing bodies expect.',
}

export default function HAADDubaiNigeria() {
  return <ExamLandingTemplate data={data} />
}

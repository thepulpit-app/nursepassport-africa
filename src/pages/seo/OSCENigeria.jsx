import ExamLandingTemplate from './ExamLandingTemplate'

const data = {
  flag: '🇬🇧',
  accentColor: '#7C3AED',
  examShort: 'NMC OSCE',
  h1: 'NMC OSCE Training for Nigerian Nurses',
  subhero: 'Build the clinical reasoning and confidence needed for the NMC Objective Structured Clinical Examination with realistic AI-scored practice scenarios.',
  introTitle: 'NMC OSCE Training in Nigeria',
  introParagraphs: [
    'The Objective Structured Clinical Examination (OSCE) is the practical component of the NMC Test of Competence, required for Nigerian-trained nurses seeking registration with the UK Nursing and Midwifery Council. Unlike the CBT, which is a written theoretical test, the OSCE assesses your ability to apply clinical knowledge in realistic, time-pressured patient scenarios under observation.',
    'Many candidates pass the CBT but find the OSCE more challenging because it requires verbalising clinical reasoning clearly, performing skills under pressure, and demonstrating safe, person-centred care in real time — skills that are difficult to practise without realistic simulation.',
    'NursePassport Africa\'s ClinicalSim AI is designed to help bridge this gap. While it cannot replace hands-on practical training, it builds the clinical reasoning muscle that underpins OSCE performance — presenting realistic patient situations, requiring you to articulate your assessment and actions clearly, and giving instant feedback against NICE and RCOG standards.',
    'Combined with our evidence-based courses covering CTG interpretation, obstetric emergencies and basic life support, NursePassport Africa gives Nigerian nurses a structured way to build the knowledge foundation that supports strong OSCE performance.',
  ],
  features: [
    { emoji: '🩺', title: 'ClinicalSim AI', desc: 'Practice articulating clinical assessments and actions for realistic scenarios — building the verbal reasoning OSCE examiners assess.' },
    { emoji: '📚', title: 'NICE & RCOG Courses', desc: 'Core clinical knowledge in CTG interpretation, obstetric emergencies and BLS — the foundation OSCE scenarios are built on.' },
    { emoji: '⚡', title: 'Weekly Challenges', desc: 'A new clinical scenario every Monday, helping you build a consistent practice rhythm in the months before your OSCE.' },
    { emoji: '🏆', title: 'Leaderboard & Streaks', desc: 'Stay motivated with daily streaks and see how you compare with other nurses preparing for the same exams.' },
  ],
  whyPoints: [
    'Built by Ibiwunmi Ajijola RN, who has been through UK registration and understands what OSCE examiners are looking for.',
    'Scenarios built on NICE (2022) and RCOG guidelines — the same clinical framework OSCE stations are designed around.',
    'Instant AI feedback helps you identify gaps in your clinical reasoning before your test date.',
    '62+ scenarios covering CTG, Obstetric Emergencies, BLS and general clinical decision-making, with more added regularly.',
    'Affordable pricing in Naira, with a free tier to get started.',
    'A growing community of Nigerian nurses sharing their NMC registration journeys.',
  ],
  faqs: [
    { q: 'Can an online platform really prepare me for a practical exam like the OSCE?', a: 'NursePassport Africa builds the clinical knowledge and reasoning foundation that underpins OSCE performance. It is most effective when combined with hands-on practical training, such as OSCE preparation courses offered by approved test centres.' },
    { q: 'What topics does ClinicalSim AI cover for OSCE preparation?', a: 'Our scenarios cover CTG interpretation, obstetric emergencies, basic life support, medication safety, and general clinical decision-making — common themes across NMC OSCE stations.' },
    { q: 'How is feedback given on ClinicalSim scenarios?', a: 'After you respond to a scenario in your own words, AI evaluates your response against NICE and RCOG guidelines and gives you feedback on what you got right, what was missed, and the ideal clinical pathway.' },
    { q: 'Is there a free way to try this?', a: 'Yes, visit nursepassportafrica.com/try for a free practice scenario without creating an account.' },
    { q: 'What other exams does NursePassport Africa support?', a: 'In addition to NMC CBT and OSCE preparation, NursePassport Africa supports NCLEX-RN (USA), HAAD and DHA (UAE), and NMBN (Nigeria) preparation.' },
  ],
  ctaTitle: 'Build your OSCE-ready clinical reasoning',
  ctaSubtitle: 'Practice real scenarios and get instant feedback before your exam date.',
}

export default function OSCENigeria() {
  return <ExamLandingTemplate data={data} />
}

import ExamLandingTemplate from './ExamLandingTemplate'

const data = {
  flag: '📈',
  accentColor: '#F43F5E',
  examShort: 'CTG Interpretation',
  h1: 'CTG Training for Nigerian Nurses and Midwives',
  subhero: 'Master cardiotocograph (CTG) interpretation with courses and AI-powered clinical simulations built on NICE (2022) guidelines.',
  introTitle: 'CTG Training in Nigeria',
  introParagraphs: [
    'Cardiotocography (CTG) is one of the most important — and most commonly tested — clinical skills for nurses and midwives working in obstetric and maternity care. Correct CTG interpretation can be the difference between recognising fetal distress early and missing a critical warning sign.',
    'CTG interpretation is also a major focus area in international nursing exams. The NMC CBT and OSCE, NCLEX-RN, and HAAD/DHA exams all test candidates\' ability to classify CTG traces as normal, suspicious or pathological, and to take appropriate clinical action.',
    'Despite its importance, many Nigerian nursing and midwifery training programmes do not provide extensive hands-on practice interpreting real CTG traces using the structured framework — baseline, variability, accelerations, decelerations — that NICE guidelines require.',
    'NursePassport Africa offers a dedicated CTG Interpretation course built to NICE (2022) standards, combined with ClinicalSim AI scenarios covering the full range of CTG patterns — from reassuring traces with accelerations, to suspicious patterns with reduced variability, to pathological patterns including late decelerations, prolonged decelerations, and sinusoidal patterns requiring emergency action.',
  ],
  features: [
    { emoji: '📚', title: 'CTG Interpretation Course', desc: 'A structured course covering the NICE (2022) framework for classifying CTG traces as normal, suspicious or pathological.' },
    { emoji: '🩺', title: '20+ CTG Scenarios', desc: 'ClinicalSim scenarios covering accelerations, decelerations, bradycardia, tachycardia, reduced variability and emergency patterns.' },
    { emoji: '⚡', title: 'Instant AI Feedback', desc: 'Submit your interpretation and clinical response, and receive instant feedback scored against NICE and RCOG guidelines.' },
    { emoji: '🏆', title: 'AMCC Certificate', desc: 'Complete the CTG course and assessment to earn a verifiable AMCC certificate for your professional portfolio.' },
  ],
  whyPoints: [
    'CTG interpretation is tested across NMC CBT/OSCE, NCLEX-RN, and HAAD/DHA exams — making it one of the highest-value topics to master.',
    'Built by Ibiwunmi Ajijola RN, with 24 years of clinical experience including obstetric and midwifery practice across Nigeria, UAE, USA and UK.',
    'Scenarios cover the full spectrum — from straightforward reassuring traces to complex emergencies like cord prolapse and sinusoidal patterns.',
    'Each scenario gives you instant feedback on what you got right, what was missed, and the ideal clinical pathway — accelerating your learning.',
    'Affordable pricing in Naira with a free tier to start immediately.',
    'Track your progress with streaks, weekly challenges and a leaderboard to stay motivated.',
  ],
  faqs: [
    { q: 'What does the CTG course cover?', a: 'The course covers the NICE (2022) framework for CTG interpretation — baseline rate, variability, accelerations and decelerations — and how to classify traces as normal, suspicious or pathological, with appropriate clinical actions for each category.' },
    { q: 'How many CTG-related scenarios are available?', a: 'NursePassport Africa currently offers 20+ CTG-focused ClinicalSim scenarios, covering everything from normal traces to complex emergencies, with more being added regularly as the platform grows toward 100+ total scenarios.' },
    { q: 'Is CTG interpretation tested in NCLEX, NMC and HAAD exams?', a: 'Yes. CTG interpretation and fetal monitoring are commonly tested topics across NCLEX-RN, NMC CBT/OSCE, and HAAD/DHA exams, making it a high-value area to master regardless of which exam you are preparing for.' },
    { q: 'Can I try a CTG scenario for free?', a: 'Yes, visit nursepassportafrica.com/try to attempt a free CTG ClinicalSim scenario without creating an account.' },
    { q: 'Do I get a certificate after completing the CTG course?', a: 'Yes, completing the course and passing the assessment earns you a verifiable AMCC-certified certificate with a unique QR code.' },
  ],
  ctaTitle: 'Master CTG interpretation today',
  ctaSubtitle: 'One of the highest-value clinical skills for international nursing exams.',
}

export default function CTGTrainingNigeria() {
  return <ExamLandingTemplate data={data} />
}

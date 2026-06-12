import ExamLandingTemplate from './ExamLandingTemplate'

const data = {
  flag: '🇺🇸',
  accentColor: '#4F46E5',
  examShort: 'NCLEX-RN',
  h1: 'NCLEX-RN Preparation for Nigerian Nurses',
  subhero: 'Prepare for the NCLEX-RN with clinical simulations, dedicated question banks, and evidence-based courses — built for African nurses pursuing US registration.',
  introTitle: 'NCLEX-RN Preparation in Nigeria',
  introParagraphs: [
    'The NCLEX-RN (National Council Licensure Examination for Registered Nurses) is the licensing exam required for Nigerian nurses seeking registration and employment as registered nurses in the United States. It is a computer adaptive test that evaluates clinical judgment across client needs categories including safe and effective care environment, health promotion, psychosocial integrity, and physiological integrity.',
    'For Nigerian nurses, preparing for the NCLEX-RN while balancing work and family commitments can be challenging. Most preparation materials are designed for the US healthcare system and US-trained nurses, which can make some content feel unfamiliar to nurses trained in Nigeria.',
    'NursePassport Africa was built specifically to bridge this gap. Our platform combines evidence-based clinical courses, an NCLEX-aligned question bank, and AI-powered ClinicalSim scenarios that mirror the clinical judgment style questions you will encounter on test day.',
    'Whether you are just starting your NCLEX-RN journey or are in the final weeks before your test date, NursePassport Africa gives you a structured pathway — learn the content, practice clinical decision-making, and test your knowledge with exam-style questions.',
  ],
  features: [
    { emoji: '❓', title: 'NCLEX Question Bank', desc: 'Practice questions aligned to the NCLEX-RN test plan, covering all client needs categories with detailed rationales.' },
    { emoji: '🩺', title: 'ClinicalSim AI', desc: 'Practice clinical judgment scenarios and get instant AI feedback scored against NICE and RCOG guidelines.' },
    { emoji: '🔥', title: 'Exam Countdown', desc: 'Set your NCLEX-RN exam date and track your daily preparation with streaks and milestones.' },
    { emoji: '🏆', title: 'AMCC Certificates', desc: 'Earn verifiable certificates as you complete courses — useful for documenting your continuing education.' },
  ],
  whyPoints: [
    'Built by Ibiwunmi Ajijola RN, a clinician licensed and practising in the UAE, USA and Nigeria — someone who understands the journey Nigerian nurses are on.',
    'Affordable pricing in Naira — no need for expensive international subscriptions billed in USD.',
    'A growing question bank of 62+ clinical scenarios, with new content added regularly toward 100+.',
    'Daily clinical nuggets delivered to your phone to build consistent study habits.',
    'A free tier so you can start preparing today without any financial commitment.',
    'A community of Nigerian and African nurses on the same journey — share scores, ask questions, and stay motivated.',
  ],
  faqs: [
    { q: 'Is NursePassport Africa specifically designed for NCLEX-RN preparation?', a: 'NursePassport Africa offers NCLEX-aligned question banks and clinical simulation scenarios as part of a broader platform that also covers NMC, HAAD, DHA and NMBN preparation. If your focus is NCLEX-RN, you can concentrate on that track within the platform.' },
    { q: 'How much does NCLEX preparation cost on NursePassport Africa?', a: 'NursePassport Africa offers a free Grace tier with limited access, a Nurse plan at ₦4,500 per month, and a Passport plan at ₦9,000 per month with unlimited simulations and access to all exam tracks including NCLEX.' },
    { q: 'Can I try the platform before signing up?', a: 'Yes. You can try a free ClinicalSim scenario at nursepassportafrica.com/try without creating an account.' },
    { q: 'Does NursePassport Africa guarantee I will pass the NCLEX-RN?', a: 'No platform can guarantee exam results. NursePassport Africa provides evidence-based preparation resources, practice questions, and clinical simulations to support your preparation, but your results depend on your own study and clinical experience.' },
    { q: 'How is ClinicalSim AI different from regular question banks?', a: 'ClinicalSim AI presents you with a realistic patient scenario and asks you to write out your clinical response in your own words, just as you would think through a real situation. AI then scores your response and gives detailed feedback — building the clinical judgment skills NCLEX-RN now emphasises.' },
  ],
  ctaTitle: 'Start your NCLEX-RN preparation today',
  ctaSubtitle: 'Join Nigerian nurses preparing for international registration with NursePassport Africa.',
}

export default function NCLEXNigeria() {
  return <ExamLandingTemplate data={data} />
}

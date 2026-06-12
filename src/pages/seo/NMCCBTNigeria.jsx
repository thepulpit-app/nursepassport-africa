import ExamLandingTemplate from './ExamLandingTemplate'

const data = {
  flag: '🇬🇧',
  accentColor: '#0891B2',
  examShort: 'NMC CBT & OSCE',
  h1: 'NMC CBT and OSCE Preparation for Nigerian Nurses',
  subhero: 'Prepare for the UK Nursing and Midwifery Council Computer Based Test and OSCE with AI clinical simulations and structured courses built on NICE and RCOG standards.',
  introTitle: 'NMC CBT and OSCE Preparation in Nigeria',
  introParagraphs: [
    'The Nursing and Midwifery Council (NMC) Test of Competence is the route Nigerian-trained nurses must complete to register as a nurse in the United Kingdom. It consists of two parts: the Computer Based Test (CBT), which assesses theoretical knowledge of nursing and midwifery practice, and the Objective Structured Clinical Examination (OSCE), a practical assessment of clinical skills.',
    'Many Nigerian nurses find the CBT challenging not because they lack clinical knowledge, but because the test format, terminology and clinical guidelines used in the UK — particularly NICE and RCOG guidance — differ from what is commonly taught in Nigerian nursing programmes.',
    'NursePassport Africa addresses this directly. Our courses are built specifically to NICE (2022) and RCOG standards, the same guidelines referenced in NMC test material. Our ClinicalSim AI scenarios present realistic patient situations and score your clinical decisions against these international guidelines — building the exact thinking patterns the CBT and OSCE assess.',
    'Whether you are preparing for your first CBT attempt or returning after an unsuccessful attempt, NursePassport Africa gives you a structured, affordable, Nigeria-friendly pathway to NMC registration.',
  ],
  features: [
    { emoji: '📚', title: 'NICE & RCOG Aligned Courses', desc: 'CTG Interpretation, Obstetric Emergencies, BLS and more — built to the exact guidelines referenced in NMC assessments.' },
    { emoji: '🩺', title: 'ClinicalSim AI', desc: 'Practice OSCE-style clinical scenarios and receive instant feedback on your clinical reasoning and decision-making.' },
    { emoji: '⚡', title: 'Weekly Challenges', desc: 'A new clinical scenario every Monday to build consistent exam-ready thinking.' },
    { emoji: '🏆', title: 'AMCC Certificates', desc: 'Verifiable certificates for completed courses to support your professional portfolio.' },
  ],
  whyPoints: [
    'Built by Ibiwunmi Ajijola RN, licensed and practising in the UAE, USA and Nigeria, with first-hand understanding of the NMC registration journey.',
    'Courses built specifically on NICE (2022) and RCOG guidelines — the exact framework the NMC test of competence references.',
    'Affordable pricing in Naira — designed for Nigerian nurses, not priced for UK or US markets.',
    '62+ clinical scenarios across CTG, Obstetrics, BLS, NMC OSCE-style cases and more, growing toward 100+.',
    'A free tier so you can explore the platform before committing financially.',
    'Daily clinical nuggets and streak tracking to build consistent preparation habits over the months leading to your test date.',
  ],
  faqs: [
    { q: 'Does NursePassport Africa prepare nurses specifically for the NMC CBT?', a: 'NursePassport Africa offers courses and clinical simulations aligned to NICE and RCOG guidelines, which form the clinical foundation for NMC test of competence content. Our platform supports your broader clinical knowledge and decision-making preparation.' },
    { q: 'What is the difference between the CBT and OSCE?', a: 'The CBT is a computer-based theoretical test covering nursing and midwifery practice. The OSCE is a practical, in-person assessment of clinical skills conducted at an approved test centre, typically after passing the CBT.' },
    { q: 'How does ClinicalSim AI help with OSCE preparation?', a: 'ClinicalSim AI presents realistic patient scenarios and requires you to articulate your clinical reasoning and actions, similar to how OSCE examiners assess your verbal reasoning and decision-making during practical stations.' },
    { q: 'Can I access this from Nigeria?', a: 'Yes. NursePassport Africa is a web-based platform accessible from anywhere, with pricing in Nigerian Naira and payment via Paystack.' },
    { q: 'Is there a free way to try the platform first?', a: 'Yes, visit nursepassportafrica.com/try to attempt a free ClinicalSim scenario without creating an account.' },
  ],
  ctaTitle: 'Start your NMC registration journey today',
  ctaSubtitle: 'Build the clinical knowledge and confidence you need for CBT and OSCE success.',
}

export default function NMCCBTNigeria() {
  return <ExamLandingTemplate data={data} />
}

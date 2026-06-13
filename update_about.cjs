const fs = require('fs')
let c = fs.readFileSync('src/pages/About.jsx', 'utf8')
let changes = 0

// 1. Our Reach - broaden beyond "the Gulf" (pure ASCII, safe direct match)
const oldReach = "Designed for Nigerian nurses, built for the Gulf, recognised internationally. Our curriculum aligns to NICE, NMC, HAAD, and NMBN standards."
const newReach = "Designed for Nigerian nurses, built for global healthcare systems. Our curriculum aligns to NICE, NMC, HAAD, and NMBN standards - preparing nurses for careers across the UK, UAE, USA, Canada and beyond."
if (c.includes(oldReach)) { c = c.replace(oldReach, newReach); changes++; console.log('1. Our Reach updated') }
else console.log('1. NOT FOUND - Our Reach text')

// 2. Sidebar caption name - simple text replace
if (c.includes('>Ibiwunmi Ajijola</div>')) {
  c = c.replace('>Ibiwunmi Ajijola</div>', '>Ibiwunmi Oluwayemisi Ajijola</div>')
  changes++; console.log('2. Sidebar name updated')
} else console.log('2. NOT FOUND - sidebar name')

// 3. Sidebar credentials line - regex to handle middle-dot encoding variants
const sidebarCredRegex = /(<div style=\{\{ fontSize: '12px', color: '#4F46E5', fontWeight: '600', marginTop: '2px' \}\}>)RN[^<]*<\/div>/
if (sidebarCredRegex.test(c)) {
  c = c.replace(sidebarCredRegex, `$1RN (US) \u00B7 RM (UAE) \u00B7 RN/RM (NG)</div>`)
  changes++; console.log('3. Sidebar credentials updated')
} else console.log('3. NOT FOUND - sidebar credentials line')

// 4. Main heading credentials line - regex
const mainCredRegex = /(<div style=\{\{ fontSize: '13px', color: '#4F46E5', fontWeight: '700', marginBottom: '16px' \}\}>\s*)RN[^<]*?MSc Healthcare Management \(in view\)/
if (mainCredRegex.test(c)) {
  c = c.replace(mainCredRegex, `$1RN (US) \u00B7 RM (UAE) \u00B7 RN/RM (NG) \u00B7 BSc Nursing (Edinburgh Napier) \u00B7 MSc Healthcare Management (in view)`)
  changes++; console.log('4. Main heading credentials updated')
} else console.log('4. NOT FOUND - main heading credentials')

// 5. Bio paragraph 1 - remove UK from clinical experience claim (pure ASCII)
const oldBio1 = "With over 24 years of clinical experience spanning Nigeria, the United Arab Emirates and the United Kingdom, Ibiwunmi brings a rare combination of frontline bedside expertise and international clinical standards to every course she designs and delivers."
const newBio1 = "With over 24 years of clinical experience spanning Nigeria and the United Arab Emirates, and having met the registration requirements of the UK's Nursing and Midwifery Council, Ibiwunmi brings a rare combination of frontline bedside expertise and international clinical standards to every course she designs and delivers."
if (c.includes(oldBio1)) { c = c.replace(oldBio1, newBio1); changes++; console.log('5. Bio paragraph 1 updated') }
else console.log('5. NOT FOUND - bio paragraph 1')

// 6. Career paragraph - add Charge Midwife/Nurse title (pure ASCII)
const oldCareer = "Since 2018, she has been based in Abu Dhabi, UAE, serving across Medical, Surgical, Maternity Assessment and High Dependency Gynaecological and Obstetrics units in a JCI Accredited tertiary facility."
const newCareer = "Since 2018, she has served as Charge Midwife/Nurse across Medical, Surgical, Maternity and High Dependency (Gynae & Obstetrics) units in a JCI Accredited tertiary facility in Abu Dhabi, UAE."
if (c.includes(oldCareer)) { c = c.replace(oldCareer, newCareer); changes++; console.log('6. Career paragraph updated') }
else console.log('6. NOT FOUND - career paragraph')

fs.writeFileSync('src/pages/About.jsx', c)
console.log(`\nDone - ${changes}/6 changes applied`)

const fs = require('fs')
let c = fs.readFileSync('src/pages/courses/ModulePlayer.jsx', 'utf8')

// 1. Add FileText/Download icon import
c = c.replace(
  "import { ArrowLeft, PlayCircle, BookOpen, HelpCircle, CheckCircle, ChevronRight, Trophy } from 'lucide-react'",
  "import { ArrowLeft, PlayCircle, BookOpen, HelpCircle, CheckCircle, ChevronRight, Trophy, FileText, Download } from 'lucide-react'"
)

// 2. Replace the simple markdown renderer with a better one
const oldRenderer = `              <div className="reading-content">
                {(module?.reading_content || CTG_READING).split('\\n\\n').map((para, i) => {
                  if (para.startsWith('## ')) return <h2 key={i}>{para.replace('## ', '')}</h2>
                  if (para.startsWith('# ')) return <h2 key={i} style={{ fontSize: '18px', marginTop: '8px' }}>{para.replace('# ', '')}</h2>
                  return <p key={i} style={{ margin: '0 0 12px' }}>{para}</p>
                })}
              </div>`

const newRenderer = `              <div className="reading-content">
                {renderMarkdown(module?.reading_content || CTG_READING)}
              </div>
              {module?.pdf_url && (
                <a href={module.pdf_url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '12px 16px', marginTop: '16px', textDecoration: 'none' }}>
                  <div style={{ width: '36px', height: '36px', background: '#4F46E5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '13px' }}>Download Module PDF</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>Full reading material as a PDF document</div>
                  </div>
                  <Download size={18} color="#4F46E5" />
                </a>
              )}`

c = c.replace(oldRenderer, newRenderer)

// 3. Add the renderMarkdown helper function before the component or near CTG_READING
// Insert it right after the imports block
c = c.replace(
  "import { ArrowLeft, PlayCircle, BookOpen, HelpCircle, CheckCircle, ChevronRight, Trophy, FileText, Download } from 'lucide-react'",
  `import { ArrowLeft, PlayCircle, BookOpen, HelpCircle, CheckCircle, ChevronRight, Trophy, FileText, Download } from 'lucide-react'

// Render simple markdown: headers, bold, bullet lists, numbered lists, horizontal rules, paragraphs
function renderInline(text) {
  // Handle **bold**
  const parts = text.split(/(\\*\\*[^*]+\\*\\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function renderMarkdown(content) {
  const lines = content.split('\\n')
  const elements = []
  let listItems = []
  let listType = null // 'ul' | 'ol'

  function flushList(key) {
    if (listItems.length === 0) return
    if (listType === 'ol') {
      elements.push(<ol key={'list-' + key} style={{ paddingLeft: '20px', margin: '0 0 14px' }}>{listItems}</ol>)
    } else {
      elements.push(<ul key={'list-' + key} style={{ paddingLeft: '20px', margin: '0 0 14px' }}>{listItems}</ul>)
    }
    listItems = []
    listType = null
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (trimmed === '') { flushList(i); return }
    if (trimmed === '---') { flushList(i); elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />); return }

    if (trimmed.startsWith('#### ')) { flushList(i); elements.push(<h4 key={i} style={{ fontSize: '14px', fontWeight: '800', color: '#0A2540', margin: '14px 0 6px' }}>{renderInline(trimmed.replace('#### ', ''))}</h4>); return }
    if (trimmed.startsWith('### ')) { flushList(i); elements.push(<h3 key={i} style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '16px 0 8px' }}>{renderInline(trimmed.replace('### ', ''))}</h3>); return }
    if (trimmed.startsWith('## ')) { flushList(i); elements.push(<h2 key={i} style={{ fontSize: '18px', fontWeight: '800', color: '#0A2540', margin: '18px 0 10px' }}>{renderInline(trimmed.replace('## ', ''))}</h2>); return }
    if (trimmed.startsWith('# ')) { flushList(i); elements.push(<h1 key={i} style={{ fontSize: '20px', fontWeight: '900', color: '#0A2540', margin: '0 0 12px' }}>{renderInline(trimmed.replace('# ', ''))}</h1>); return }

    // Bullet list
    const bulletMatch = trimmed.match(/^[-*]\\s+(.*)/)
    if (bulletMatch) {
      if (listType !== 'ul') flushList(i)
      listType = 'ul'
      listItems.push(<li key={i} style={{ marginBottom: '6px', lineHeight: '1.6' }}>{renderInline(bulletMatch[1])}</li>)
      return
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^\\d+\\.\\s+(.*)/)
    if (numberedMatch) {
      if (listType !== 'ol') flushList(i)
      listType = 'ol'
      listItems.push(<li key={i} style={{ marginBottom: '6px', lineHeight: '1.6' }}>{renderInline(numberedMatch[1])}</li>)
      return
    }

    // Regular paragraph
    flushList(i)
    elements.push(<p key={i} style={{ margin: '0 0 12px', lineHeight: '1.7' }}>{renderInline(trimmed)}</p>)
  })

  flushList('end')
  return elements
}`
)

fs.writeFileSync('src/pages/courses/ModulePlayer.jsx', c)
console.log('ModulePlayer.jsx updated with markdown renderer and PDF section')

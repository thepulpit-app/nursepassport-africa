const fs = require('fs')
let c = fs.readFileSync('src/admin/pages/AdminCourses.jsx', 'utf8')

// 1. Add pdf_url to new module default and save payloads
c = c.replace(
  "video_url: '', estimated_minutes: 45,",
  "video_url: '', pdf_url: '', estimated_minutes: 45,"
)
c = c.replaceAll(
  "          video_url: editingModule.video_url,",
  "          video_url: editingModule.video_url,\n          pdf_url: editingModule.pdf_url,"
)

// 2. Add pdfFile state
c = c.replace(
  "  const [msg, setMsg] = useState('')",
  "  const [msg, setMsg] = useState('')\n  const [pdfFile, setPdfFile] = useState(null)\n  const [uploadingPdf, setUploadingPdf] = useState(false)"
)

// 3. Add upload function before saveModule
c = c.replace(
  "  async function saveModule() {",
  `  async function uploadModulePdf(file, moduleId) {
    setUploadingPdf(true)
    const path = \`module-pdfs/\${moduleId || 'new-' + Date.now()}-\${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}\`
    const { error } = await supabase.storage.from('certificates').upload(path, file, { upsert: true })
    setUploadingPdf(false)
    if (error) { setMsg('PDF upload failed: ' + error.message); return null }
    const { data } = supabase.storage.from('certificates').getPublicUrl(path)
    return data.publicUrl
  }

  async function saveModule() {
    if (pdfFile) {
      const url = await uploadModulePdf(pdfFile, editingModule.id)
      if (url) editingModule.pdf_url = url
    }`
)

// 4. Add PDF upload UI after Video URL field
c = c.replace(
  `              <div>
                <label style={LABEL}>Video URL</label>
                <input value={editingModule.video_url || ''} onChange={e => setEditingModule(x => ({ ...x, video_url: e.target.value }))} placeholder="https://youtube.com/embed/..." style={INPUT} />
              </div>`,
  `              <div>
                <label style={LABEL}>Video URL</label>
                <input value={editingModule.video_url || ''} onChange={e => setEditingModule(x => ({ ...x, video_url: e.target.value }))} placeholder="https://youtube.com/embed/..." style={INPUT} />
              </div>
              <div>
                <label style={LABEL}>Module PDF (optional)</label>
                <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])}
                  style={{ ...INPUT, padding: '8px 12px' }} />
                {pdfFile && <div style={{ fontSize: '12px', color: '#4F46E5', marginTop: '6px', fontWeight: '600' }}>📄 {pdfFile.name} — will upload on save</div>}
                {!pdfFile && editingModule.pdf_url && (
                  <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '6px', fontWeight: '600' }}>
                    ✅ PDF attached — <a href={editingModule.pdf_url} target="_blank" rel="noreferrer" style={{ color: '#4F46E5' }}>View current PDF</a>
                  </div>
                )}
                {uploadingPdf && <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>Uploading PDF...</div>}
              </div>`
)

// 5. Clear pdfFile state when opening module editor (new or edit)
c = c.replaceAll(
  "setEditingModule({ course_id: course.id, title: '', description: '', reading_content: '', video_url: '', pdf_url: '', estimated_minutes: 45, tier_required: 'nurse', sort_order: (modules[course.id]?.length || 0) + 1, is_published: false })",
  "setEditingModule({ course_id: course.id, title: '', description: '', reading_content: '', video_url: '', pdf_url: '', estimated_minutes: 45, tier_required: 'nurse', sort_order: (modules[course.id]?.length || 0) + 1, is_published: false }); setPdfFile(null)"
)
c = c.replace(
  "<button onClick={() => { setMsg(''); setEditingModule({ ...mod }) }}",
  "<button onClick={() => { setMsg(''); setEditingModule({ ...mod }); setPdfFile(null) }}"
)

fs.writeFileSync('src/admin/pages/AdminCourses.jsx', c)
console.log('AdminCourses.jsx updated with PDF upload')

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ signatory1_name: '', signatory1_title: '', signatory1_signature_url: '', signatory2_name: '', signatory2_title: '', signatory2_signature_url: '', logo_url: '' })
  const [files, setFiles] = useState({ sig1: null, sig2: null, logo: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('platform_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(data)
      setLoading(false)
    })
  }, [])

  async function upload(file, path) {
    await supabase.storage.from('certificates').upload(path, file, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(path)
    return publicUrl
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    let updated = { ...settings }
    if (files.logo) updated.logo_url = await upload(files.logo, `logos/logo.${files.logo.name.split('.').pop()}`)
    if (files.sig1) updated.signatory1_signature_url = await upload(files.sig1, `signatures/sig1.${files.sig1.name.split('.').pop()}`)
    if (files.sig2) updated.signatory2_signature_url = await upload(files.sig2, `signatures/sig2.${files.sig2.name.split('.').pop()}`)
    await supabase.from('platform_settings').upsert({ id: 1, ...updated })
    setSettings(updated)
    setFiles({ sig1: null, sig2: null, logo: null })
    setMsg('Settings saved successfully!')
    setSaving(false)
  }

  const INPUT = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }
  const LABEL = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }

  if (loading) return <div style={{ color: '#94A3B8' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: '0 0 24px' }}>Platform Settings</h1>

      {msg && <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '12px 16px', color: '#22C55E', fontWeight: '700', fontSize: '13px', marginBottom: '20px' }}>{msg}</div>}

      {/* Logo */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Platform Logo</h2>
        {settings.logo_url && <div style={{ marginBottom: '12px', padding: '12px', background: '#0A2540', borderRadius: '10px', width: 'fit-content' }}><img src={settings.logo_url} style={{ height: '48px', objectFit: 'contain' }} alt="Logo" /></div>}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1.5px dashed #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4F46E5', width: 'fit-content' }}>
          📤 {files.logo ? files.logo.name : 'Upload Logo'}
          <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, logo: e.target.files[0] }))} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Signatory 1 */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Signatory 1 — Clinical Director</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div><label style={LABEL}>Full Name</label><input value={settings.signatory1_name} onChange={e => setSettings(s => ({ ...s, signatory1_name: e.target.value }))} style={INPUT} placeholder="Dr. Ibiwunmi Ajijola" /></div>
          <div><label style={LABEL}>Title</label><input value={settings.signatory1_title} onChange={e => setSettings(s => ({ ...s, signatory1_title: e.target.value }))} style={INPUT} placeholder="Clinical Director, AMCC" /></div>
        </div>
        {settings.signatory1_signature_url && <div style={{ marginBottom: '8px' }}><img src={settings.signatory1_signature_url} style={{ height: '50px', objectFit: 'contain' }} alt="Signature 1" /></div>}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1.5px dashed #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4F46E5', width: 'fit-content' }}>
          ✍️ {files.sig1 ? files.sig1.name : 'Upload Signature'}
          <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, sig1: e.target.files[0] }))} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Signatory 2 */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Signatory 2 — Director</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div><label style={LABEL}>Full Name</label><input value={settings.signatory2_name} onChange={e => setSettings(s => ({ ...s, signatory2_name: e.target.value }))} style={INPUT} placeholder="Tope Ajijola" /></div>
          <div><label style={LABEL}>Title</label><input value={settings.signatory2_title} onChange={e => setSettings(s => ({ ...s, signatory2_title: e.target.value }))} style={INPUT} placeholder="Director, NursePassport Africa" /></div>
        </div>
        {settings.signatory2_signature_url && <div style={{ marginBottom: '8px' }}><img src={settings.signatory2_signature_url} style={{ height: '50px', objectFit: 'contain' }} alt="Signature 2" /></div>}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1.5px dashed #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4F46E5', width: 'fit-content' }}>
          ✍️ {files.sig2 ? files.sig2.name : 'Upload Signature'}
          <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, sig2: e.target.files[0] }))} style={{ display: 'none' }} />
        </label>
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
        {saving ? 'Saving...' : '💾 Save Settings'}
      </button>
    </div>
  )
}

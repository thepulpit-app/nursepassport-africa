import { useEffect, useState } from 'react'
import { Save, Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminShell from './AdminShell'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    signatory1_name: '',
    signatory1_title: '',
    signatory1_signature_url: '',
    signatory2_name: '',
    signatory2_title: '',
    signatory2_signature_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sig1File, setSig1File] = useState(null)
  const [sig2File, setSig2File] = useState(null)

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    const { data } = await supabase.from('platform_settings').select('*').eq('id', 1).single()
    if (data) setSettings(data)
    setLoading(false)
  }

  async function uploadSignature(file, number) {
    const ext = file.name.split('.').pop()
    const path = `signatures/signatory${number}.${ext}`
    const { error } = await supabase.storage.from('certificates').upload(path, file, { upsert: true })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(path)
    return publicUrl
  }

  async function handleSave() {
    setSaving(true)
    try {
      let updatedSettings = { ...settings }

      if (sig1File) {
        const url = await uploadSignature(sig1File, 1)
        updatedSettings.signatory1_signature_url = url
      }
      if (sig2File) {
        const url = await uploadSignature(sig2File, 2)
        updatedSettings.signatory2_signature_url = url
      }

      const { error } = await supabase.from('platform_settings').upsert({ id: 1, ...updatedSettings })
      if (error) throw error
      setSettings(updatedSettings)
      toast.success('Settings saved!')
    } catch (err) {
      toast.error('Failed to save: ' + err.message)
    }
    setSaving(false)
  }

  const INPUT_STYLE = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }
  const LABEL_STYLE = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }

  return (
    <AdminShell>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Platform Settings</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Certificate signatories and platform configuration</p>
      </div>

      {loading ? <div style={{ height: '300px', background: '#F1F5F9', borderRadius: '16px' }} /> : (
        <>
          {/* Signatory 1 */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Signatory 1 — Clinical Director</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={LABEL_STYLE}>Full Name</label>
                <input value={settings.signatory1_name} onChange={e => setSettings(s => ({ ...s, signatory1_name: e.target.value }))}
                  placeholder="e.g. Dr. Ibiwunmi Ajijola" style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Title</label>
                <input value={settings.signatory1_title} onChange={e => setSettings(s => ({ ...s, signatory1_title: e.target.value }))}
                  placeholder="e.g. Clinical Director, AMCC" style={INPUT_STYLE} />
              </div>
            </div>
            <div>
              <label style={LABEL_STYLE}>Signature Image</label>
              {settings.signatory1_signature_url && (
                <div style={{ marginBottom: '8px', padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <img src={settings.signatory1_signature_url} alt="Signature 1" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1.5px dashed #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4F46E5', width: 'fit-content' }}>
                <Upload size={14} /> {sig1File ? sig1File.name : 'Upload Signature (PNG/JPG)'}
                <input type="file" accept="image/*" onChange={e => setSig1File(e.target.files[0])} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Signatory 2 */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Signatory 2 — Director</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={LABEL_STYLE}>Full Name</label>
                <input value={settings.signatory2_name} onChange={e => setSettings(s => ({ ...s, signatory2_name: e.target.value }))}
                  placeholder="e.g. Tope Ajijola" style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Title</label>
                <input value={settings.signatory2_title} onChange={e => setSettings(s => ({ ...s, signatory2_title: e.target.value }))}
                  placeholder="e.g. Director, NursePassport Africa" style={INPUT_STYLE} />
              </div>
            </div>
            <div>
              <label style={LABEL_STYLE}>Signature Image</label>
              {settings.signatory2_signature_url && (
                <div style={{ marginBottom: '8px', padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <img src={settings.signatory2_signature_url} alt="Signature 2" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1.5px dashed #C7D2FE', background: '#EEF2FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4F46E5', width: 'fit-content' }}>
                <Upload size={14} /> {sig2File ? sig2File.name : 'Upload Signature (PNG/JPG)'}
                <input type="file" accept="image/*" onChange={e => setSig2File(e.target.files[0])} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Preview */}
          <div style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>Certificate Preview</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {[{ name: settings.signatory1_name || 'Signatory 1', title: settings.signatory1_title || 'Title', url: settings.signatory1_signature_url },
                { name: settings.signatory2_name || 'Signatory 2', title: settings.signatory2_title || 'Title', url: settings.signatory2_signature_url }
              ].map((sig, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: '160px' }}>
                  {sig.url && <img src={sig.url} alt="sig" style={{ height: '40px', objectFit: 'contain', marginBottom: '6px' }} />}
                  <div style={{ width: '160px', height: '1px', background: '#0A2540', margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#0A2540' }}>{sig.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{sig.title}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </>
      )}
    </AdminShell>
  )
}

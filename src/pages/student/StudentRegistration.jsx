import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Upload, AlertTriangle, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AppShell from '../../components/layout/AppShell'
import toast from 'react-hot-toast'

const NIGERIAN_NURSING_SCHOOLS = [
  'Ahmadu Bello University Teaching Hospital, Zaria',
  'Ambrose Alli University, Ekpoma',
  'Bayero University Kano',
  'Benue State University, Makurdi',
  'College of Health Sciences, Benue State University',
  'College of Nursing and Midwifery, Akure',
  'College of Nursing and Midwifery, Abeokuta',
  'College of Nursing and Midwifery, Asaba',
  'College of Nursing and Midwifery, Benin City',
  'College of Nursing and Midwifery, Calabar',
  'College of Nursing and Midwifery, Enugu',
  'College of Nursing and Midwifery, Ibadan',
  'College of Nursing and Midwifery, Ilorin',
  'College of Nursing and Midwifery, Jos',
  'College of Nursing and Midwifery, Kaduna',
  'College of Nursing and Midwifery, Kano',
  'College of Nursing and Midwifery, Lagos',
  'College of Nursing and Midwifery, Lafia',
  'College of Nursing and Midwifery, Maiduguri',
  'College of Nursing and Midwifery, Nnewi',
  'College of Nursing and Midwifery, Ogoja',
  'College of Nursing and Midwifery, Owerri',
  'College of Nursing and Midwifery, Port Harcourt',
  'College of Nursing and Midwifery, Sokoto',
  'College of Nursing and Midwifery, Umuahia',
  'College of Nursing and Midwifery, Uyo',
  'College of Nursing and Midwifery, Yola',
  'College of Nursing Sciences, LUTH, Lagos',
  'Delta State University, Abraka',
  'Ebonyi State University, Abakaliki',
  'Ekiti State University, Ado-Ekiti',
  'Federal University of Health Sciences, Ila Orangun',
  'Federal University, Oye-Ekiti',
  'Igbinedion University, Okada',
  'Imo State University, Owerri',
  'Kogi State University, Anyigba',
  'Lagos State University, Ojo',
  'Ladoke Akintola University of Technology, Ogbomosho',
  'Nasarawa State University, Keffi',
  'Niger Delta University, Wilberforce Island',
  'Nnamdi Azikiwe University, Awka',
  'Obafemi Awolowo University, Ile-Ife',
  'Olabisi Onabanjo University, Ago-Iwoye',
  'Rivers State University, Port Harcourt',
  'School of Nursing, ABUTH Zaria',
  'School of Nursing, AKTH Kano',
  'School of Nursing, LASUTH Lagos',
  'School of Nursing, LUTH Lagos',
  'School of Nursing, OAUTHC Ile-Ife',
  'School of Nursing, UCH Ibadan',
  'School of Nursing, UNTH Enugu',
  'School of Nursing, UUTH Uyo',
  'Tai Solarin University of Education, Ijagun',
  'University of Benin, Benin City',
  'University of Calabar',
  'University of Ibadan',
  'University of Ilorin',
  'University of Jos',
  'University of Lagos',
  'University of Maiduguri',
  'University of Nigeria, Nsukka',
  'University of Port Harcourt',
  'University of Uyo',
  'Usmanu Danfodiyo University, Sokoto',
  'Other (specify in student ID field)',
].sort()

const LEVELS = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Postgraduate']

export default function StudentRegistration() {
  const { profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    school: '',
    student_id_number: '',
    level: '',
  })
  const [idFile, setIdFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large — max 5MB'); return }
    setIdFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!form.school || !form.student_id_number || !form.level) {
      return toast.error('Please fill in all fields')
    }
    if (!idFile) return toast.error('Please upload your student ID card')
    if (!agreed) return toast.error('Please agree to the declaration')

    setLoading(true)
    try {
      // Upload student ID to Supabase storage
      const fileExt = idFile.name.split('.').pop()
      const filePath = `student-ids/${profile.id}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, idFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath)

      // Update profile
      await supabase.from('profiles').update({
        is_student: true,
        student_school: form.school,
        student_id_number: form.student_id_number,
        student_level: form.level,
        student_id_url: publicUrl,
        subscription_tier: 'student',
        diagnostic_completed: true,
        qualification: 'Nursing Student',
      }).eq('id', profile.id)

      toast.success('Student registration complete!')
      navigate('/billing')
    } catch (err) {
      toast.error('Registration failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Student Registration</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Get 50% off with your student ID</p>
      </div>

      {/* Student benefit card */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '20px', padding: '20px', marginBottom: '20px', color: 'white' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎓</div>
        <h2 style={{ color: 'white', fontWeight: '800', fontSize: '18px', margin: '0 0 6px' }}>Student Plan — ₦1750/month</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: '0 0 14px', lineHeight: '1.5' }}>
          50% off the Nurse plan. Access all courses and modules while you're still in school.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['All course modules', 'Module assessments', 'AMCC certificates on completion', 'Discounted upgrade to Nurse or Passport when you qualify'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} color="rgba(255,255,255,0.8)" />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540', margin: '0 0 16px' }}>Your School Details</h2>

        {/* School dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Nursing School
          </label>
          <select value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
            style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: form.school ? '#0A2540' : '#94A3B8', background: 'white' }}>
            <option value="">Select your school...</option>
            {NIGERIAN_NURSING_SCHOOLS.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>

        {/* Student ID number */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Student ID Number / Matriculation Number
          </label>
          <input type="text" value={form.student_id_number} onChange={e => setForm(f => ({ ...f, student_id_number: e.target.value }))}
            placeholder="e.g. NRS/2021/001"
            style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} />
        </div>

        {/* Level */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Current Level
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {LEVELS.map(level => (
              <button key={level} type="button" onClick={() => setForm(f => ({ ...f, level }))}
                style={{ padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid', borderColor: form.level === level ? '#4F46E5' : '#E2E8F0', background: form.level === level ? '#EEF2FF' : 'white', color: form.level === level ? '#4F46E5' : '#64748B' }}>
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* ID card upload */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Student ID Card Photo
          </label>
          {preview ? (
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img src={preview} alt="ID Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1.5px solid #BBF7D0' }} />
              <button onClick={() => { setIdFile(null); setPreview(null) }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: '#F43F5E', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '24px', borderRadius: '12px', border: '2px dashed #E2E8F0', background: '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Upload size={24} color="#94A3B8" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>Upload Student ID</div>
                <div style={{ color: '#94A3B8', fontSize: '12px' }}>JPG, PNG or PDF — max 5MB</div>
              </div>
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      {/* Declaration */}
      <div style={{ background: '#FFF7ED', borderRadius: '16px', border: '1px solid #FDE68A', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: '800', color: '#92400E', fontSize: '14px', marginBottom: '6px' }}>Legal Declaration</div>
            <p style={{ color: '#92400E', fontSize: '12px', lineHeight: '1.6', margin: '0 0 12px' }}>
              I declare that the information I have provided above is true and accurate. I understand that providing false information to obtain a student discount constitutes fraud and that NursePassport Africa / AMCC reserves the right to revoke my account and pursue legal action under applicable Nigerian law in the event that the information provided is found to be false or misleading.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4F46E5' }} />
              <span style={{ fontWeight: '700', color: '#92400E', fontSize: '13px' }}>
                I agree to this declaration and confirm my information is truthful
              </span>
            </label>
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading || !agreed}
        style={{ width: '100%', padding: '16px', background: agreed && !loading ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F1F5F9', color: agreed && !loading ? 'white' : '#94A3B8', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: agreed && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {loading ? 'Registering...' : <><span>Complete Student Registration</span> <ChevronRight size={18} /></>}
      </button>

      <p style={{ textAlign: 'center', marginTop: '12px', color: '#94A3B8', fontSize: '12px', lineHeight: '1.5' }}>
        After registration you will be directed to complete your subscription at the student rate.
        Your ID will be reviewed and your account may be suspended if information is found to be false.
      </p>
    </AppShell>
  )
}

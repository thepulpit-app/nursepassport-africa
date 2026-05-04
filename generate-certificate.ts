import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, courseId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get user and course details
    const [{ data: profile }, { data: course }] = await Promise.all([
      supabase.from('profiles').select('full_name, email').eq('id', userId).single(),
      supabase.from('courses').select('title, slug').eq('id', courseId).single(),
    ])

    if (!profile || !course) {
      return new Response(JSON.stringify({ error: 'Profile or course not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if certificate already exists
    const { data: existing } = await supabase
      .from('certificates')
      .select('id, certificate_number')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ certificate_number: existing.certificate_number, already_exists: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate certificate number
    const { count } = await supabase.from('certificates').select('*', { count: 'exact', head: true })
    const certNumber = `NPA-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(6, '0')}`

    // Generate HTML certificate
    const issueDate = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    
    const certHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1123px; height: 794px; font-family: 'Inter', sans-serif; background: white; overflow: hidden; }
  .cert { width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; }
  .border-outer { position: absolute; inset: 12px; border: 3px solid #0A2540; border-radius: 4px; }
  .border-inner { position: absolute; inset: 18px; border: 1px solid #00897B; border-radius: 2px; }
  .header { text-align: center; margin-bottom: 32px; }
  .logo-area { display: flex; align-items: center; gap: 12px; justify-content: center; margin-bottom: 20px; }
  .logo-box { width: 56px; height: 56px; background: #0A2540; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .brand { text-align: left; }
  .brand-name { font-size: 20px; font-weight: 700; color: #0A2540; }
  .brand-sub { font-size: 12px; color: #64748B; }
  .divider { width: 120px; height: 3px; background: linear-gradient(90deg, #0A2540, #00897B); margin: 0 auto 20px; border-radius: 99px; }
  .cert-title { font-family: 'Playfair Display', serif; font-size: 14px; color: #64748B; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 8px; }
  .cert-of { font-family: 'Playfair Display', serif; font-size: 42px; color: #0A2540; font-weight: 700; margin-bottom: 24px; }
  .presented { font-size: 14px; color: #64748B; margin-bottom: 12px; }
  .nurse-name { font-family: 'Playfair Display', serif; font-size: 48px; color: #0A2540; font-style: italic; margin-bottom: 24px; border-bottom: 2px solid #00897B; padding-bottom: 12px; display: inline-block; }
  .completion { font-size: 14px; color: #64748B; margin-bottom: 8px; }
  .course-name { font-size: 22px; font-weight: 700; color: #0A2540; margin-bottom: 32px; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; margin-top: 40px; }
  .sig-block { text-align: center; }
  .sig-line { width: 160px; height: 1px; background: #0A2540; margin: 0 auto 6px; }
  .sig-name { font-size: 12px; font-weight: 600; color: #0A2540; }
  .sig-title { font-size: 11px; color: #64748B; }
  .cert-id { text-align: center; }
  .cert-id-label { font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; }
  .cert-id-value { font-size: 12px; font-weight: 700; color: #0A2540; font-family: monospace; }
  .badge { background: #0A2540; color: white; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; }
  .teal { color: #00897B; }
  .watermark { position: absolute; bottom: 40px; right: 40px; opacity: 0.05; font-size: 80px; font-weight: 900; color: #0A2540; font-family: 'Playfair Display', serif; }
</style>
</head>
<body>
<div class="cert">
  <div class="border-outer"></div>
  <div class="border-inner"></div>
  <div class="watermark">AMCC</div>
  
  <div class="header">
    <div class="logo-area">
      <div class="logo-box">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white"/>
        </svg>
      </div>
      <div class="brand">
        <div class="brand-name">NursePassport <span class="teal">Africa</span></div>
        <div class="brand-sub">Powered by AMCC · Advanced Medical Care Consultancy</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="cert-title">This is to certify that</div>
  </div>

  <div style="text-align:center">
    <div class="nurse-name">${profile.full_name}</div>
    <div class="completion">has successfully completed the course</div>
    <div class="course-name">${course.title}</div>
    <div class="completion">with distinction · Aligned to NICE (2022) & RCOG Standards</div>
  </div>

  <div class="footer">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">Dr. Ibiwunmi Ajijola</div>
      <div class="sig-title">Clinical Director, AMCC</div>
    </div>
    <div class="cert-id">
      <div class="cert-id-label">Certificate ID</div>
      <div class="cert-id-value">${certNumber}</div>
      <div style="margin-top:6px"><span class="badge">AMCC CERTIFIED</span></div>
      <div style="font-size:11px;color:#94A3B8;margin-top:4px">${issueDate}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">Tope Ajijola</div>
      <div class="sig-title">Director, NursePassport Africa</div>
    </div>
  </div>
</div>
</body>
</html>`

    // Convert HTML to PDF using a simple approach - store HTML and convert URL
    const htmlBlob = new Blob([certHTML], { type: 'text/html' })
    const htmlPath = `${userId}/${certNumber}.html`
    
    // Upload HTML to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(htmlPath, htmlBlob, { contentType: 'text/html', upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(htmlPath)

    // Insert certificate record
    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        certificate_number: certNumber,
        pdf_url: publicUrl,
        issued_at: new Date().toISOString(),
        is_valid: true,
      })
      .select()
      .single()

    if (certError) throw certError

    return new Response(JSON.stringify({
      success: true,
      certificate_number: certNumber,
      url: publicUrl,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

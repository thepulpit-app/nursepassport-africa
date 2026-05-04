import { supabase } from './supabase'

export async function checkAndIssueCertificate(userId, courseId) {
  try {
    // Get all published modules for this course
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId)
      .eq('is_published', true)

    if (!modules || modules.length === 0) return null

    // Get user progress for this course
    const { data: progress } = await supabase
      .from('user_progress')
      .select('module_id, quiz_passed')
      .eq('user_id', userId)
      .eq('course_id', courseId)

    // Check if all modules are completed
    const completedModuleIds = progress?.filter(p => p.quiz_passed).map(p => p.module_id) || []
    const allCompleted = modules.every(m => completedModuleIds.includes(m.id))

    if (!allCompleted) return null

    // Check if certificate already exists
    const { data: existing } = await supabase
      .from('certificates')
      .select('certificate_number')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (existing) return existing.certificate_number

    // Trigger certificate generation via Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-certificate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId, courseId })
    })

    const result = await response.json()
    return result.certificate_number

  } catch (error) {
    console.error('Certificate generation error:', error)
    return null
  }
}
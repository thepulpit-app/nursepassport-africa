export async function evaluateSimResponse(scenario, nurseResponse) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  
  const response = await fetch(`${supabaseUrl}/functions/v1/claude-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ scenario, nurseResponse })
  })

  const data = await response.json()

  if (data.error) {
    console.error('Edge function error:', data.error)
    throw new Error(data.error)
  }

  return data
}
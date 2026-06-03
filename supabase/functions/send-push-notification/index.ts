import webpush from 'npm:web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { title, body, url, subscriptions } = await req.json()

    const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjZJgLQyj5Q3aqEVnXKZKJPEQILKY'
    const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || ''

    webpush.setVapidDetails(
      'mailto:hello@nursepassportafrica.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    )

    const payload = JSON.stringify({ title, body, url })
    let sent = 0
    let failed = 0

    for (const sub of subscriptions) {
      try {
        const subscription = JSON.parse(sub.subscription)
        await webpush.sendNotification(subscription, payload)
        sent++
      } catch (err) {
        console.error('Failed:', err.message)
        failed++
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

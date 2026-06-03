import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
    const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!

    webpush.setVapidDetails(
      'mailto:hello@nursepassportafrica.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    )

    // Get today's nugget based on day of month
    const dayOfMonth = new Date().getDate()
    const { data: nugget } = await supabase
      .from('scheduled_nuggets')
      .select('*')
      .eq('day_of_month', dayOfMonth)
      .single()

    if (!nugget) {
      return new Response(JSON.stringify({ error: 'No nugget for today' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get all push subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription, user_id')

    if (!subscriptions?.length) {
      return new Response(JSON.stringify({ message: 'No subscribers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const payload = JSON.stringify({
      title: '📚 ' + nugget.title,
      body: nugget.body,
      url: nugget.url
    })

    let sent = 0
    let failed = 0

    for (const sub of subscriptions) {
      try {
        const subscription = JSON.parse(sub.subscription)
        await webpush.sendNotification(subscription, payload)
        sent++
      } catch (err) {
        console.error('Failed to send:', err.message)
        failed++
      }
    }

    // Log to history
    await supabase.from('nugget_history').insert({
      title: nugget.title,
      body: nugget.body,
      sent_to: sent,
      sent_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ success: true, nugget: nugget.title, sent, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

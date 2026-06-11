import { createClient } from 'npm:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

const NURSEPASSPORT_PLANS: Record<string, string> = {
  'nurse_monthly':    'nurse',
  'nurse_annual':     'nurse',
  'passport_monthly': 'passport',
  'passport_annual':  'passport',
  'student_monthly':  'student',
}

const SPIRITSCRIPT_WEBHOOK = 'https://myklwmjsgfdfeglmgggg.supabase.co/functions/v1/paystack-webhook'

function detectProduct(metadata: Record<string, any>, planName: string): string {
  if (metadata?.product) return metadata.product
  if (metadata?.custom_fields) {
    const productField = metadata.custom_fields.find((f: any) => 
      f.variable_name === 'product' || f.display_name === 'product'
    )
    if (productField?.value) return productField.value
  }
  if (metadata?.plan && NURSEPASSPORT_PLANS[metadata.plan]) return 'nursepassport'
  const name = (planName || '').toLowerCase()
  if (name.includes('nurse') || name.includes('passport') || name.includes('student')) return 'nursepassport'
  if (name.includes('spirit') || name.includes('mantle') || name.includes('throne') || name.includes('grace')) return 'spiritscript'
  return 'unknown'
}

function detectPlanKey(metadata: Record<string, any>, data: any): string | undefined {
  // 1. From metadata.plan directly
  if (metadata?.plan && NURSEPASSPORT_PLANS[metadata.plan]) return metadata.plan

  // 2. From custom_fields
  if (metadata?.custom_fields) {
    const planField = metadata.custom_fields.find((f: any) =>
      f.variable_name === 'plan' || f.display_name === 'Plan'
    )
    if (planField?.value && NURSEPASSPORT_PLANS[planField.value]) return planField.value
  }

  // 3. From plan name matching
  const planName = (data.plan?.name || data.plan_object?.name || '').toLowerCase()
  if (planName) {
    for (const key of Object.keys(NURSEPASSPORT_PLANS)) {
      const keyWords = key.replace(/_/g, ' ')
      if (planName.includes(keyWords) || keyWords.includes(planName)) return key
    }
    if (planName.includes('nurse') && planName.includes('annual')) return 'nurse_annual'
    if (planName.includes('nurse')) return 'nurse_monthly'
    if (planName.includes('passport') && planName.includes('annual')) return 'passport_annual'
    if (planName.includes('passport')) return 'passport_monthly'
    if (planName.includes('student')) return 'student_monthly'
  }

  // 4. From amount matching — most reliable for renewals
  const amount = data.amount
  const amountMap: Record<number, string> = {
    450000:  'nurse_monthly',
    4000000: 'nurse_annual',
    900000:  'passport_monthly',
    8000000: 'passport_annual',
    175000:  'student_monthly',
  }
  if (amount && amountMap[amount]) return amountMap[amount]

  return undefined
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature')
    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')

    if (secret && signature) {
      const hash = createHmac('sha512', secret).update(body).digest('hex')
      if (hash !== signature) {
        return new Response('Invalid signature', { status: 401 })
      }
    }

    const event = JSON.parse(body)
    console.log('Paystack event:', event.event)

    if (event.event !== 'charge.success') {
      return new Response('OK', { headers: corsHeaders })
    }

    const data = event.data
    const metadata = data.metadata || {}
    const planName = data.plan?.name || data.plan_object?.name || ''
    const product = detectProduct(metadata, planName)

    console.log('Detected product:', product)
    console.log('Plan name:', planName)
    console.log('Amount:', data.amount)

    if (product === 'spiritscript') {
      console.log('Forwarding to SpiritScript webhook')
      await fetch(SPIRITSCRIPT_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-paystack-signature': signature || '',
        },
        body,
      })
      return new Response('OK', { headers: corsHeaders })
    }

    if (product === 'nursepassport') {
      const email = data.customer?.email
      const userId = metadata.userId
      const plan = detectPlanKey(metadata, data)
      const newTier = plan ? NURSEPASSPORT_PLANS[plan] : undefined

      console.log('Detected plan key:', plan)
      console.log('New tier:', newTier)

      if (!newTier) {
        console.log('Could not detect plan — amount:', data.amount, 'planName:', planName)
        return new Response('OK', { headers: corsHeaders })
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      const isAnnual = plan!.includes('annual')
      const now = new Date()
      const endDate = new Date(now)
      if (isAnnual) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      let query = supabase.from('profiles').update({
        subscription_tier: newTier,
        subscription_status: 'active',
        subscription_start_date: now.toISOString(),
        subscription_end_date: endDate.toISOString(),
        diagnostic_completed: true,
      })

      if (userId) {
        query = query.eq('id', userId)
      } else if (email) {
        query = query.eq('email', email)
      } else {
        console.log('No userId or email found')
        return new Response('OK', { headers: corsHeaders })
      }

      const { error } = await query
      if (error) {
        console.error('Error updating profile:', error)
        return new Response('Error', { status: 500, headers: corsHeaders })
      }

      console.log(`Updated ${email || userId} to ${newTier} until ${endDate.toISOString()}`)
    }

    return new Response('OK', { headers: corsHeaders })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500, headers: corsHeaders })
  }
})

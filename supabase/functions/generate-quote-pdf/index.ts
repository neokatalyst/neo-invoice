// supabase/functions/generate-quote-pdf/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'
import { generateQuoteHTML } from '../../utils/generateQuoteHTML.ts'

serve(async (req) => {
  console.log('📥 Incoming request to generate-quote-pdf')

  const url = new URL(req.url)
  const quote_id = url.searchParams.get('quote_id')

  if (!quote_id) {
    return new Response('Missing quote_id', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  console.log('🔎 Fetching quote ID:', quote_id)

  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) {
    console.error('❌ Error fetching quote:', error?.message)
    return new Response('Quote not found', { status: 404 })
  }

  console.log('✅ Quote fetched:', quote)

  const html = generateQuoteHTML(quote)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*', // 👈 allow preview to work
    },
  })
})

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'
import { generateQuoteHTML } from '../../utils/generateQuoteHTML.ts'

serve(async (req) => {
  console.log('📥 Incoming request to generate-quote-pdf')

  // ✅ Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      status: 200,
      headers: corsHeaders(),
    })
  }

  const url = new URL(req.url)
  const quote_id = url.searchParams.get('quote_id')

  if (!quote_id) {
    return new Response('Missing quote_id', {
      status: 400,
      headers: corsHeaders(),
    })
  }

  const supabase = createClient(
    Deno.env.get('PRIVATE_SUPABASE_URL')!,
    Deno.env.get('PRIVATE_SUPABASE_SERVICE_ROLE_KEY')!
  )

  console.log('🔎 Fetching quote ID:', quote_id)

  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) {
    console.error('❌ Error fetching quote:', error?.message)
    return new Response('Quote not found', {
      status: 404,
      headers: corsHeaders(),
    })
  }

  console.log('✅ Quote fetched:', quote)

  const html = generateQuoteHTML(quote)

  return new Response(html, {
    status: 200,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'text/html',
      'Content-Disposition': `inline; filename="quote-${quote_id}.html"`,
    },
  })
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Change to frontend domain for production if needed
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

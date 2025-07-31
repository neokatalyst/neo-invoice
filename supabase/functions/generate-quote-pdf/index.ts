import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'
import { generateQuoteHTML } from './quoteTemplates.ts'

const supabase = createClient(
  Deno.env.get('PRIVATE_SUPABASE_URL')!,
  Deno.env.get('PRIVATE_SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders() })
  }

  const url = new URL(req.url)
  const quote_id = url.searchParams.get('quote_id')
  if (!quote_id) {
    return new Response('Missing quote_id', { status: 400, headers: corsHeaders() })
  }

  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) {
    return new Response('Quote not found', { status: 404, headers: corsHeaders() })
  }

  let logoUrl: string | undefined = undefined
  if (quote.logo_url) {
    const { data: signed } = await supabase.storage
      .from('logos')
      .createSignedUrl(quote.logo_url, 60 * 60)
    logoUrl = signed?.signedUrl
    console.log('🔗 Signed logo URL:', logoUrl)

  }

  const items = Array.isArray(quote.items) ? quote.items.map((item: { description: string; quantity: number; price: number }) => ({
    description: String(item.description ?? ''),
    quantity: Number(item.quantity) || 0,
    price: Number(item.price) || 0,
    total: Number(item.quantity) * Number(item.price)
  })) : []

  const html = generateQuoteHTML({
    client_name: String(quote.client_name ?? ''),
    client_email: String(quote.client_email ?? ''),
    reference: String(quote.reference ?? ''),
    items,
    total: Number(quote.total ?? 0),
  }, logoUrl)

  return new Response(html, {
    status: 200,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'text/html',
      'Content-Disposition': `inline; filename="quote-${quote.reference ?? quote.id}.html"`,
    },
  })
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

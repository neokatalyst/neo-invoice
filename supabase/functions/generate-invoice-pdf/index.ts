import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Log: Starting the function setup
console.log('🚀 Setting up Supabase client for generate-invoice-pdf...')

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

console.log('🔐 Using Supabase URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, serviceRoleKey)

serve(async (req) => {
  console.log('📥 Incoming request to generate-invoice-pdf')

  try {
    const url = new URL(req.url)
    const invoiceId = url.searchParams.get('invoice_id')

    console.log('🔎 Extracted invoice_id:', invoiceId)

    if (!invoiceId) {
      console.warn('⚠️ Missing invoice_id in query params')
      return new Response('Missing invoice_id', { status: 400 })
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle()

    if (error) {
      console.error('❌ Supabase query error:', error.message)
      return new Response('Error fetching invoice', { status: 500 })
    }

    if (!invoice) {
      console.warn('❌ Invoice not found for ID:', invoiceId)
      return new Response('Invoice not found', { status: 404 })
    }

    console.log('✅ Invoice fetched:', invoice)

    const html = `
      <html>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Invoice Preview</h1>
          <p><strong>Invoice ID:</strong> ${invoice.id}</p>
          <p><strong>Client:</strong> ${invoice.client_name}</p>
          <p><strong>Email:</strong> ${invoice.client_email}</p>
          <p><strong>Total:</strong> R ${invoice.total}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
        </body>
      </html>
    `

    console.log('🧾 Returning rendered invoice HTML')

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    })
  } catch (err) {
    console.error('💥 Unexpected function error:', err)
    return new Response('Internal server error', { status: 500 })
  }
})

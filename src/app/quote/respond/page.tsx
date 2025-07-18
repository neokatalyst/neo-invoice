'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'

export default function QuoteResponsePage() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing...')

  useEffect(() => {
    const processQuote = async () => {
      const quoteId = params?.get('quote_id')
      const action = params?.get('action')

      if (!quoteId || !['accept', 'decline'].includes(action || '')) {
        setStatus('error')
        setMessage('Invalid or missing quote details.')
        return
      }

      const newStatus = action === 'accept' ? 'accepted' : 'declined'

      const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', quoteId)

      if (error) {
        setStatus('error')
        setMessage('Something went wrong. Please contact support.')
      } else {
        setStatus('success')
        setMessage(`Thank you! Quote has been ${newStatus}.`)
      }
    }

    processQuote()
  }, [params])

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-xl mx-auto p-6 text-center bg-white rounded shadow mt-10 space-y-4">
        <h1 className="text-2xl font-bold">
          {status === 'loading' ? 'Processing Quote...' :
           status === 'success' ? 'Quote Updated' : 'Error'}
        </h1>
        <p>{message}</p>
        {status !== 'loading' && (
          <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-4 py-2 rounded">
            Return Home
          </button>
        )}
      </div>
    </div>
  )
}

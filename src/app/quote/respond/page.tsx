import { Suspense } from 'react'
import QuoteResponseHandler from './QuoteResponseHandler'

export default function QuoteResponsePage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Processing...</p>}>
      <QuoteResponseHandler />
    </Suspense>
  )
}

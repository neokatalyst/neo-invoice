'use client'

import dynamic from 'next/dynamic'

const QuoteCaptureClient = dynamic(() => import('./QuoteCaptureClient'), { ssr: false })

export default function Page() {
  return <QuoteCaptureClient />
}

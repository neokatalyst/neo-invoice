import { Suspense } from 'react'
import EditQuotePage from './EditQuotePage'

export default function Page() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <EditQuotePage />
    </Suspense>
  )
}

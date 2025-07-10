// src/components/GlobalSpinner.tsx
'use client'

import { ClipLoader } from 'react-spinners'

export default function GlobalSpinner({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
      <ClipLoader size={60} color="#2563eb" />
    </div>
  )
}

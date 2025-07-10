// src/components/RouteSpinner.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import GlobalSpinner from './GlobalSpinner'

export default function RouteSpinner() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 600) // simulate loading time
    return () => clearTimeout(timeout)
  }, [pathname])

  return <GlobalSpinner show={loading} />
}

'use client'

import { ReactNode } from 'react'

interface FullWidthLayoutProps {
  children: ReactNode
}

export default function FullWidthLayout({ children }: FullWidthLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-screen-2xl mx-auto px-4">{children}</div>
    </div>
  )
}

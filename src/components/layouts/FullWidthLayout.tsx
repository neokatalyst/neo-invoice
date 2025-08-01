'use client'

import { ReactNode } from 'react'

interface FullWidthLayoutProps {
  children: ReactNode
}

export default function FullWidthLayout({ children }: FullWidthLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-0 md:px-4 lg:px-8">{children}</div>
    </div>
  )
}

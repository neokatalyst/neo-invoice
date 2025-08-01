'use client'

import { ReactNode } from 'react'

interface CenteredLayoutProps {
  children: ReactNode
}

export default function CenteredLayout({ children }: CenteredLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  )
}

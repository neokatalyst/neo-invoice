'use client'

import { ReactNode } from 'react'
import DesktopHeader from '@/components/common/Header'
import DesktopFooter from '@/components/common/Footer'

interface PageWrapperProps {
  children: ReactNode
  withHeader?: boolean
  withFooter?: boolean
  maxWidth?: 'xl' | '2xl' | 'full'
}

export default function PageWrapper({
  children,
  withHeader = true,
  withFooter = true,
  maxWidth = '2xl'
}: PageWrapperProps) {
  const maxWidthClass = {
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'w-full',
  }[maxWidth]

  return (
    <div className="w-screen min-h-screen flex flex-col overflow-x-hidden">
      <div className="w-full bg-gray-50 flex flex-col flex-grow">
        {withHeader && <DesktopHeader />}
        <main className={`w-full px-4 ${maxWidthClass} mx-auto flex-grow`}>
          {children}
        </main>
        {withFooter && <DesktopFooter />}
      </div>
    </div>
  )
}

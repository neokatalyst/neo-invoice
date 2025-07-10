// src/app/layout.tsx
'use client'

import { Toaster } from 'react-hot-toast'
import RouteSpinner from '@/components/RouteSpinner' // Optional: for route-based spinner
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <RouteSpinner /> {/* optional global spinner for route changes */}
        {children}
      </body>
    </html>
  )
}

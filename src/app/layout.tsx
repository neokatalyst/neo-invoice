'use client'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import RouteSpinner from '@/components/RouteSpinner'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('✅ Service Worker registered at:', reg.scope))
        .catch(err => console.error('❌ Service Worker registration failed:', err));
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <RouteSpinner />
        {children}
      </body>
    </html>
  )
}

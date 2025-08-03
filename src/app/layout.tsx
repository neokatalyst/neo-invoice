'use client'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import RouteSpinner from '@/components/RouteSpinner'
import './globals.css'
import InstallPrompt from '@/components/InstallPrompt'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {
            console.log('✅ Service Worker registered at:', reg.scope)
            reg.update()
          })
          .catch(err => console.error('❌ Service Worker registration failed:', err))
      } else {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const reg of registrations) {
            reg.unregister()
            console.log('🧹 Dev Service Worker unregistered:', reg.scope)
          }
        })
      }
    }
  }, [])

  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <RouteSpinner />
        <div className="min-h-screen w-screen flex flex-col overflow-x-hidden bg-gray-50">
          <InstallPrompt />
          {children}
        </div>
      </body>
    </html>
  )
}

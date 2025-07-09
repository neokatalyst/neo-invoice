// src/components/Header.tsx
'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full py-6 bg-white shadow-md text-black">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">Neo-Invoice</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-black hover:text-blue-600">Home</Link>
          <Link href="/capture" className="text-black hover:text-blue-600">Capture</Link>
          <Link href="/dashboard" className="text-black hover:text-blue-600">Dashboard</Link>
        </nav>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import BurgerMenu from '@/components/BurgerMenu'

export default function MobileHeader() {
  return (
    <header className="w-full bg-white shadow py-4 px-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Neo-Invoice
      </Link>
      <BurgerMenu />
    </header>
  )
}

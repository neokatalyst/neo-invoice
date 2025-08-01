'use client'

import { useUserInfo } from '@/lib/hooks/useUserInfo'

export default function MobileHeader() {
  const { userName } = useUserInfo()
  return (
    <header className="w-full bg-white shadow py-4 px-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Neo-Invoice</h1>
      {userName && <span className="text-sm text-gray-500">Hi, {userName}</span>}
    </header>
  )
}

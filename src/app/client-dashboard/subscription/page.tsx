'use client'

import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'

export default function Page() {
  const content = (
    <div className="p-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-2">Page in Progress</h1>
      <p>This feature will be available in a future release.</p>
    </div>
  )

  return <ResponsiveLayout mobile={content} tablet={content} desktop={content} />
}

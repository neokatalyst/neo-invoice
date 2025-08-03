'use client'

import { ReactNode, useEffect, useState } from 'react'

interface Props {
  mobile: ReactNode
  tablet?: ReactNode
  desktop: ReactNode
}

export default function ResponsiveLayout({ mobile, tablet, desktop }: Props) {
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const mediaMobile = window.matchMedia('(max-width: 639px)')
    const mediaTablet = window.matchMedia('(min-width: 640px) and (max-width: 1023px)')

    const determineLayout = () => {
      if (mediaMobile.matches) setLayout('mobile')
      else if (mediaTablet.matches) setLayout('tablet')
      else setLayout('desktop')
    }

    // Initial layout check
    determineLayout()

    // Add event listeners
    mediaMobile.addEventListener('change', determineLayout)
    mediaTablet.addEventListener('change', determineLayout)

    // Cleanup
    return () => {
      mediaMobile.removeEventListener('change', determineLayout)
      mediaTablet.removeEventListener('change', determineLayout)
    }
  }, [])

  if (layout === 'mobile') return <>{mobile}</>
  if (layout === 'tablet') return <>{tablet ?? desktop}</> // fallback to desktop if tablet is undefined
  return <>{desktop}</>
}

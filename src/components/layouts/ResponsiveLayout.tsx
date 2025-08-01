'use client'

import { ReactNode, useEffect, useState } from 'react'

interface Props {
  mobile: ReactNode
  tablet: ReactNode
  desktop: ReactNode
}

export default function ResponsiveLayout({ mobile, tablet, desktop }: Props) {
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      if (width < 640) setLayout('mobile')
      else if (width >= 640 && width < 1024) setLayout('tablet')
      else setLayout('desktop')
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  if (layout === 'mobile') return <>{mobile}</>
  if (layout === 'tablet') return <>{tablet}</>
  return <>{desktop}</>
}

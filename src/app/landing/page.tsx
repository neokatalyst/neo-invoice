'use client'

import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import MobileLanding from '@/components/views/landing/MobileLanding'
import TabletLanding from '@/components/views/landing/TabletLanding'
import DesktopLanding from '@/components/views/landing/DesktopLanding'

export default function LandingPage() {
  return (
    <ResponsiveLayout
      desktop={<DesktopLanding />}
      tablet={<TabletLanding />}
      mobile={<MobileLanding />}
    />
  )
}

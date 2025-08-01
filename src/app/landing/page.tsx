'use client'

import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import MobileLanding from '@/components/views/landing/MobileLanding'
import CenteredLanding from '@/components/views/landing/CenteredLanding'
import DesktopLanding from '@/components/views/landing/DesktopLanding'

export default function LandingPage() {
  return (
    <ResponsiveLayout
      desktop={<DesktopLanding />}
      mobile={<MobileLanding />}
      centered={<CenteredLanding />}
    />
  )
}
'use client'

import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import MobileHeader from './MobileHeader'
import TabletHeader from './TabletHeader'
import DesktopHeader from './DesktopHeader'

export default function Header() {
  return (
    <ResponsiveLayout
      mobile={<MobileHeader />}
      tablet={<TabletHeader />}
      desktop={<DesktopHeader />}
    />
  )
}

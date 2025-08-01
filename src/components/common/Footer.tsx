import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import MobileFooter from './MobileFooter'
import TabletFooter from './TabletFooter'
import DesktopFooter from './DesktopFooter'

export default function Footer() {
  return (
    <ResponsiveLayout
      mobile={<MobileFooter />}
      tablet={<TabletFooter />}
      desktop={<DesktopFooter />}
    />
  )
}

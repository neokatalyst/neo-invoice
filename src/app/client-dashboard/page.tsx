'use client'

import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import MobileDashboard from '@/components/views/client/MobileDashboard'
import CenteredDashboard from '@/components/views/client/CenteredDashboard'
import DesktopDashboard from '@/components/views/client/DesktopDashboard'

export default function ClientDashboardPage() {
  return (
    <ResponsiveLayout
      mobile={<MobileDashboard />}
      tablet={<CenteredDashboard />}
      desktop={<DesktopDashboard />}
    />
  )
}
  
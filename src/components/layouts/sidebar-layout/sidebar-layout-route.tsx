import { Outlet } from 'react-router'
import { SidebarLayout } from './sidebar-layout'

export const SidebarLayoutRoute = () => (
  <SidebarLayout>
    <Outlet />
  </SidebarLayout>
)
